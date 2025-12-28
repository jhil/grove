/**
 * EXECUTE Intent Handler
 *
 * Executes commands on devices (plants).
 * The main command is StartStop which waters a plant.
 */

import { createClient } from "@/lib/supabase/server";
import type { GoogleHomeLink, Plant } from "@/types/supabase";
import type {
  ExecuteRequest,
  ExecuteResponse,
  ExecuteResponseCommand,
} from "../types";
import { deviceIdToPlantId, getWateredDeviceState } from "../devices";
import { COMMANDS } from "../constants";

export async function handleExecute(
  requestId: string,
  request: ExecuteRequest,
  link: GoogleHomeLink,
  userId: string
): Promise<ExecuteResponse> {
  const supabase = await createClient();

  const responseCommands: ExecuteResponseCommand[] = [];

  // Get user profile for watering event
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single();

  const userName = profile?.display_name || "Google Home";

  // Process each command
  for (const command of request.inputs[0].payload.commands) {
    const deviceIds = command.devices.map((d) => d.id);

    for (const execution of command.execution) {
      // Handle StartStop command (water plant)
      if (execution.command === COMMANDS.START_STOP) {
        const start = (execution.params as { start?: boolean })?.start;

        // Only handle "start" (watering), not "stop"
        if (!start) {
          responseCommands.push({
            ids: deviceIds,
            status: "SUCCESS",
            states: {
              online: true,
              status: "SUCCESS",
              isRunning: false,
            },
          });
          continue;
        }

        // Water each plant
        const successIds: string[] = [];
        const errorIds: string[] = [];

        for (const deviceId of deviceIds) {
          const plantId = deviceIdToPlantId(deviceId);

          if (!plantId) {
            errorIds.push(deviceId);
            continue;
          }

          // Fetch the plant to verify it exists and is linked
          const { data: plant, error: plantError } = await supabase
            .from("plants")
            .select("*")
            .eq("id", plantId)
            .single<Plant>();

          if (plantError || !plant) {
            console.error(`Plant not found: ${plantId}`);
            errorIds.push(deviceId);
            continue;
          }

          // Check if plant's grove is linked
          if (!link.linked_groves.includes(plant.grove_id)) {
            console.error(`Grove not linked: ${plant.grove_id}`);
            errorIds.push(deviceId);
            continue;
          }

          // Water the plant - update last_watered and create watering event
          const now = new Date().toISOString();

          // Calculate streak
          let newStreakCount = plant.streak_count;
          let newBestStreak = plant.best_streak;
          let streakStartedAt = plant.streak_started_at;

          // Check if watering is on time (within interval + 1 day grace period)
          if (plant.last_watered) {
            const lastWatered = new Date(plant.last_watered);
            const daysSinceLastWatered = Math.floor(
              (Date.now() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
            );
            const gracePeriod = plant.watering_interval + 1;

            if (daysSinceLastWatered <= gracePeriod) {
              // On time - continue streak
              newStreakCount = plant.streak_count + 1;
              if (newStreakCount > newBestStreak) {
                newBestStreak = newStreakCount;
              }
            } else {
              // Overdue - reset streak
              newStreakCount = 1;
              streakStartedAt = now;
            }
          } else {
            // First watering
            newStreakCount = 1;
            streakStartedAt = now;
          }

          // Update plant
          const { error: updateError } = await supabase
            .from("plants")
            .update({
              last_watered: now,
              streak_count: newStreakCount,
              best_streak: newBestStreak,
              streak_started_at: streakStartedAt,
              updated_at: now,
            })
            .eq("id", plantId);

          if (updateError) {
            console.error(`Failed to update plant: ${updateError.message}`);
            errorIds.push(deviceId);
            continue;
          }

          // Create watering event
          await supabase.from("watering_events").insert({
            plant_id: plantId,
            grove_id: plant.grove_id,
            user_id: userId,
            user_name: userName,
          });

          successIds.push(deviceId);
        }

        // Build response for successful waters
        if (successIds.length > 0) {
          responseCommands.push({
            ids: successIds,
            status: "SUCCESS",
            states: getWateredDeviceState(),
          });
        }

        // Build response for errors
        if (errorIds.length > 0) {
          responseCommands.push({
            ids: errorIds,
            status: "ERROR",
            errorCode: "deviceNotFound",
          });
        }
      } else {
        // Unsupported command
        responseCommands.push({
          ids: deviceIds,
          status: "ERROR",
          errorCode: "functionNotSupported",
          debugString: `Unsupported command: ${execution.command}`,
        });
      }
    }
  }

  return {
    requestId,
    payload: {
      commands: responseCommands,
    },
  };
}
