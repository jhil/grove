/**
 * Activity tools for Plangrove MCP server
 */
import * as z from "zod";
import { getClient } from "../lib/supabase.js";
import { isLoggedIn } from "../lib/config.js";
function requireAuth() {
    if (!isLoggedIn()) {
        throw new Error("Not logged in. Use the login tool first.");
    }
}
export function registerActivityTools(server) {
    // Get watering history
    server.registerTool("get_watering_history", {
        title: "Watering History",
        description: "Get recent watering events for a grove",
        inputSchema: {
            groveId: z.string().describe("The grove ID"),
            limit: z.number().min(1).max(100).optional().describe("Number of events (default 20)"),
        },
        outputSchema: {
            events: z.array(z.object({
                id: z.string(),
                plantId: z.string(),
                plantName: z.string().optional(),
                wateredBy: z.string().nullable(),
                wateredAt: z.string(),
            })),
        },
    }, async ({ groveId, limit = 20 }) => {
        requireAuth();
        const client = getClient();
        // Get watering events with plant names
        const { data: events, error } = await client
            .from("watering_events")
            .select("*, plants(name)")
            .eq("grove_id", groveId)
            .order("created_at", { ascending: false })
            .limit(limit);
        if (error) {
            throw new Error(`Failed to get watering history: ${error.message}`);
        }
        const output = {
            events: (events || []).map((e) => ({
                id: e.id,
                plantId: e.plant_id,
                plantName: e.plants?.name,
                wateredBy: e.user_name,
                wateredAt: e.created_at,
            })),
        };
        return {
            content: [
                {
                    type: "text",
                    text: output.events.length > 0
                        ? output.events
                            .map((e) => {
                            const date = new Date(e.wateredAt).toLocaleDateString();
                            const who = e.wateredBy || "Someone";
                            return `- ${date}: ${who} watered ${e.plantName || "a plant"}`;
                        })
                            .join("\n")
                        : "No watering events found.",
                },
            ],
            structuredContent: output,
        };
    });
    // Get grove stats
    server.registerTool("get_grove_stats", {
        title: "Grove Statistics",
        description: "Get analytics and statistics for a grove",
        inputSchema: {
            groveId: z.string().describe("The grove ID"),
        },
        outputSchema: {
            stats: z.object({
                totalPlants: z.number(),
                plantsNeedingWater: z.number(),
                totalWaterings: z.number(),
                wateringsThisWeek: z.number(),
                averageStreak: z.number(),
                topStreak: z.number(),
            }),
        },
    }, async ({ groveId }) => {
        requireAuth();
        const client = getClient();
        // Get plants
        const { data: plants, error: plantsError } = await client
            .from("plants")
            .select("*")
            .eq("grove_id", groveId);
        if (plantsError) {
            throw new Error(`Failed to get plants: ${plantsError.message}`);
        }
        // Get watering events count
        const { count: totalWaterings } = await client
            .from("watering_events")
            .select("*", { count: "exact", head: true })
            .eq("grove_id", groveId);
        // Get waterings this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { count: wateringsThisWeek } = await client
            .from("watering_events")
            .select("*", { count: "exact", head: true })
            .eq("grove_id", groveId)
            .gte("created_at", weekAgo.toISOString());
        // Calculate stats from plants
        const now = new Date();
        let plantsNeedingWater = 0;
        let totalStreak = 0;
        let topStreak = 0;
        for (const plant of plants || []) {
            if (plant.last_watered) {
                const lastWatered = new Date(plant.last_watered);
                const daysSince = Math.floor((now.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24));
                if (daysSince >= plant.watering_interval) {
                    plantsNeedingWater++;
                }
            }
            else {
                plantsNeedingWater++;
            }
            totalStreak += plant.streak_count;
            if (plant.best_streak > topStreak) {
                topStreak = plant.best_streak;
            }
        }
        const plantCount = (plants || []).length;
        const averageStreak = plantCount > 0 ? Math.round(totalStreak / plantCount) : 0;
        const output = {
            stats: {
                totalPlants: plantCount,
                plantsNeedingWater,
                totalWaterings: totalWaterings || 0,
                wateringsThisWeek: wateringsThisWeek || 0,
                averageStreak,
                topStreak,
            },
        };
        return {
            content: [
                {
                    type: "text",
                    text: `Grove Statistics:
- Total plants: ${output.stats.totalPlants}
- Need water: ${output.stats.plantsNeedingWater}
- Total waterings: ${output.stats.totalWaterings}
- This week: ${output.stats.wateringsThisWeek}
- Average streak: ${output.stats.averageStreak}
- Top streak: ${output.stats.topStreak}`,
                },
            ],
            structuredContent: output,
        };
    });
}
