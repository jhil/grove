/**
 * Plant tools for Plangrove MCP server
 */
import * as z from "zod";
import { getClient, getCurrentUser } from "../lib/supabase.js";
import { isLoggedIn } from "../lib/config.js";
function requireAuth() {
    if (!isLoggedIn()) {
        throw new Error("Not logged in. Use the login tool first.");
    }
}
function calculateUrgency(plant) {
    if (!plant.last_watered) {
        return { status: "unknown", daysOverdue: 0 };
    }
    const lastWatered = new Date(plant.last_watered);
    const now = new Date();
    const daysSinceWatered = Math.floor((now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24));
    const daysOverdue = daysSinceWatered - plant.watering_interval;
    if (daysOverdue > 2) {
        return { status: "critical", daysOverdue };
    }
    else if (daysOverdue > 0) {
        return { status: "overdue", daysOverdue };
    }
    else if (daysOverdue >= -1) {
        return { status: "soon", daysOverdue };
    }
    else {
        return { status: "ok", daysOverdue };
    }
}
export function registerPlantTools(server) {
    // List plants
    server.registerTool("list_plants", {
        title: "List Plants",
        description: "List all plants in a grove",
        inputSchema: {
            groveId: z.string().describe("The grove ID"),
        },
        outputSchema: {
            plants: z.array(z.object({
                id: z.string(),
                name: z.string(),
                type: z.string(),
                wateringInterval: z.number(),
                lastWatered: z.string().nullable(),
                status: z.string(),
                streakCount: z.number(),
            })),
        },
    }, async ({ groveId }) => {
        requireAuth();
        const client = getClient();
        const { data: plants, error } = await client
            .from("plants")
            .select("*")
            .eq("grove_id", groveId)
            .order("created_at", { ascending: false });
        if (error) {
            throw new Error(`Failed to list plants: ${error.message}`);
        }
        const output = {
            plants: (plants || []).map((p) => {
                const urgency = calculateUrgency(p);
                return {
                    id: p.id,
                    name: p.name,
                    type: p.type,
                    wateringInterval: p.watering_interval,
                    lastWatered: p.last_watered,
                    status: urgency.status,
                    streakCount: p.streak_count,
                };
            }),
        };
        return {
            content: [
                {
                    type: "text",
                    text: output.plants.length > 0
                        ? output.plants
                            .map((p) => `- ${p.name} (${p.type}) [${p.status}] - streak: ${p.streakCount}`)
                            .join("\n")
                        : "No plants in this grove.",
                },
            ],
            structuredContent: output,
        };
    });
    // Get plant
    server.registerTool("get_plant", {
        title: "Get Plant",
        description: "Get details of a specific plant",
        inputSchema: {
            plantId: z.string().describe("The plant ID"),
        },
        outputSchema: {
            plant: z.object({
                id: z.string(),
                groveId: z.string(),
                name: z.string(),
                type: z.string(),
                wateringInterval: z.number(),
                lastWatered: z.string().nullable(),
                notes: z.string().nullable(),
                status: z.string(),
                streakCount: z.number(),
                bestStreak: z.number(),
                birthday: z.string().nullable(),
            }),
        },
    }, async ({ plantId }) => {
        requireAuth();
        const client = getClient();
        const { data: plant, error } = await client
            .from("plants")
            .select("*")
            .eq("id", plantId)
            .single();
        if (error) {
            if (error.code === "PGRST116") {
                throw new Error(`Plant not found: ${plantId}`);
            }
            throw new Error(`Failed to get plant: ${error.message}`);
        }
        const urgency = calculateUrgency(plant);
        const output = {
            plant: {
                id: plant.id,
                groveId: plant.grove_id,
                name: plant.name,
                type: plant.type,
                wateringInterval: plant.watering_interval,
                lastWatered: plant.last_watered,
                notes: plant.notes,
                status: urgency.status,
                streakCount: plant.streak_count,
                bestStreak: plant.best_streak,
                birthday: plant.birthday,
            },
        };
        return {
            content: [
                {
                    type: "text",
                    text: `${plant.name} (${plant.type})\nStatus: ${urgency.status}\nWatering: every ${plant.watering_interval} days\nStreak: ${plant.streak_count} (best: ${plant.best_streak})${plant.notes ? `\nNotes: ${plant.notes}` : ""}`,
                },
            ],
            structuredContent: output,
        };
    });
    // Create plant
    server.registerTool("create_plant", {
        title: "Create Plant",
        description: "Add a new plant to a grove",
        inputSchema: {
            groveId: z.string().describe("The grove ID to add the plant to"),
            name: z.string().describe("Name for the plant"),
            type: z.string().describe("Type of plant (e.g., 'Pothos', 'Snake Plant')"),
            wateringInterval: z
                .number()
                .min(1)
                .max(90)
                .describe("Days between watering (1-90)"),
            notes: z.string().optional().describe("Optional notes about the plant"),
        },
        outputSchema: {
            plant: z.object({
                id: z.string(),
                name: z.string(),
                type: z.string(),
            }),
        },
    }, async ({ groveId, name, type, wateringInterval, notes }) => {
        requireAuth();
        const client = getClient();
        const { data: plant, error } = await client
            .from("plants")
            .insert({
            grove_id: groveId,
            name,
            type,
            watering_interval: wateringInterval,
            notes: notes || null,
            streak_count: 0,
            best_streak: 0,
        })
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create plant: ${error.message}`);
        }
        const output = {
            plant: {
                id: plant.id,
                name: plant.name,
                type: plant.type,
            },
        };
        return {
            content: [
                {
                    type: "text",
                    text: `Created plant "${plant.name}" (${plant.type}) in grove ${groveId}`,
                },
            ],
            structuredContent: output,
        };
    });
    // Update plant
    server.registerTool("update_plant", {
        title: "Update Plant",
        description: "Update a plant's details",
        inputSchema: {
            plantId: z.string().describe("The plant ID to update"),
            name: z.string().optional().describe("New name"),
            type: z.string().optional().describe("New type"),
            wateringInterval: z.number().optional().describe("New watering interval in days"),
            notes: z.string().optional().describe("New notes"),
        },
        outputSchema: {
            plant: z.object({
                id: z.string(),
                name: z.string(),
            }),
        },
    }, async ({ plantId, name, type, wateringInterval, notes }) => {
        requireAuth();
        const client = getClient();
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (type !== undefined)
            updates.type = type;
        if (wateringInterval !== undefined)
            updates.watering_interval = wateringInterval;
        if (notes !== undefined)
            updates.notes = notes;
        if (Object.keys(updates).length === 0) {
            throw new Error("No updates provided");
        }
        const { data: plant, error } = await client
            .from("plants")
            .update(updates)
            .eq("id", plantId)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to update plant: ${error.message}`);
        }
        const output = {
            plant: {
                id: plant.id,
                name: plant.name,
            },
        };
        return {
            content: [{ type: "text", text: `Updated plant "${plant.name}"` }],
            structuredContent: output,
        };
    });
    // Delete plant
    server.registerTool("delete_plant", {
        title: "Delete Plant",
        description: "Remove a plant from a grove",
        inputSchema: {
            plantId: z.string().describe("The plant ID to delete"),
        },
        outputSchema: {
            success: z.boolean(),
            message: z.string(),
        },
    }, async ({ plantId }) => {
        requireAuth();
        const client = getClient();
        const { error } = await client.from("plants").delete().eq("id", plantId);
        if (error) {
            throw new Error(`Failed to delete plant: ${error.message}`);
        }
        const output = {
            success: true,
            message: `Deleted plant ${plantId}`,
        };
        return {
            content: [{ type: "text", text: output.message }],
            structuredContent: output,
        };
    });
    // Water plant
    server.registerTool("water_plant", {
        title: "Water Plant",
        description: "Record watering a plant (updates last watered time and streak)",
        inputSchema: {
            plantId: z.string().describe("The plant ID to water"),
        },
        outputSchema: {
            plant: z.object({
                id: z.string(),
                name: z.string(),
                lastWatered: z.string(),
                streakCount: z.number(),
                bestStreak: z.number(),
            }),
        },
    }, async ({ plantId }) => {
        requireAuth();
        const client = getClient();
        const user = await getCurrentUser();
        // Get current plant
        const { data: currentPlant, error: fetchError } = await client
            .from("plants")
            .select("*")
            .eq("id", plantId)
            .single();
        if (fetchError) {
            throw new Error(`Failed to get plant: ${fetchError.message}`);
        }
        const now = new Date();
        const nowIso = now.toISOString();
        // Calculate streak
        let newStreakCount = 1;
        let newBestStreak = currentPlant.best_streak;
        let streakStartedAt = nowIso;
        if (currentPlant.last_watered) {
            const lastWatered = new Date(currentPlant.last_watered);
            const daysSince = Math.floor((now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24));
            // If watered within the interval window, continue streak
            if (daysSince <= currentPlant.watering_interval + 1) {
                newStreakCount = currentPlant.streak_count + 1;
                streakStartedAt = currentPlant.streak_started_at || nowIso;
            }
        }
        if (newStreakCount > newBestStreak) {
            newBestStreak = newStreakCount;
        }
        // Update plant
        const { data: plant, error: updateError } = await client
            .from("plants")
            .update({
            last_watered: nowIso,
            streak_count: newStreakCount,
            best_streak: newBestStreak,
            streak_started_at: streakStartedAt,
        })
            .eq("id", plantId)
            .select()
            .single();
        if (updateError) {
            throw new Error(`Failed to water plant: ${updateError.message}`);
        }
        // Log watering event
        await client.from("watering_events").insert({
            plant_id: plantId,
            grove_id: currentPlant.grove_id,
            user_id: user?.userId || null,
            user_name: user?.displayName || user?.email || null,
            created_at: nowIso,
        });
        const output = {
            plant: {
                id: plant.id,
                name: plant.name,
                lastWatered: plant.last_watered,
                streakCount: plant.streak_count,
                bestStreak: plant.best_streak,
            },
        };
        return {
            content: [
                {
                    type: "text",
                    text: `Watered "${plant.name}"! Streak: ${plant.streak_count} (best: ${plant.best_streak})`,
                },
            ],
            structuredContent: output,
        };
    });
}
