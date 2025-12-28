/**
 * Grove tools for Plangrove MCP server
 */
import * as z from "zod";
import { getClient } from "../lib/supabase.js";
import { isLoggedIn } from "../lib/config.js";
function requireAuth() {
    if (!isLoggedIn()) {
        throw new Error("Not logged in. Use the login tool first.");
    }
}
function generateGroveId(name) {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 40);
    const random = Math.random().toString(36).substring(2, 6);
    return `${slug}-${random}`;
}
export function registerGroveTools(server) {
    // List groves
    server.registerTool("list_groves", {
        title: "List Groves",
        description: "List all groves you have access to",
        inputSchema: {},
        outputSchema: {
            groves: z.array(z.object({
                id: z.string(),
                name: z.string(),
                plantCount: z.number(),
                createdAt: z.string(),
            })),
        },
    }, async () => {
        requireAuth();
        const client = getClient();
        // Get all groves (in a real app, we'd filter by user access)
        const { data: groves, error } = await client
            .from("groves")
            .select("*, plants(count)")
            .order("updated_at", { ascending: false });
        if (error) {
            throw new Error(`Failed to list groves: ${error.message}`);
        }
        const output = {
            groves: (groves || []).map((g) => ({
                id: g.id,
                name: g.name,
                plantCount: g.plants?.[0]?.count || 0,
                createdAt: g.created_at,
            })),
        };
        return {
            content: [
                {
                    type: "text",
                    text: output.groves.length > 0
                        ? output.groves
                            .map((g) => `- ${g.name} (${g.id}) - ${g.plantCount} plants`)
                            .join("\n")
                        : "No groves found.",
                },
            ],
            structuredContent: output,
        };
    });
    // Get grove
    server.registerTool("get_grove", {
        title: "Get Grove",
        description: "Get details of a specific grove",
        inputSchema: {
            groveId: z.string().describe("The grove ID"),
        },
        outputSchema: {
            grove: z.object({
                id: z.string(),
                name: z.string(),
                coverPhoto: z.string().nullable(),
                plantCount: z.number(),
                createdAt: z.string(),
                updatedAt: z.string(),
            }),
        },
    }, async ({ groveId }) => {
        requireAuth();
        const client = getClient();
        const { data: grove, error } = await client
            .from("groves")
            .select("*, plants(count)")
            .eq("id", groveId)
            .single();
        if (error) {
            if (error.code === "PGRST116") {
                throw new Error(`Grove not found: ${groveId}`);
            }
            throw new Error(`Failed to get grove: ${error.message}`);
        }
        const output = {
            grove: {
                id: grove.id,
                name: grove.name,
                coverPhoto: grove.cover_photo,
                plantCount: grove.plants?.[0]?.count || 0,
                createdAt: grove.created_at,
                updatedAt: grove.updated_at,
            },
        };
        return {
            content: [
                {
                    type: "text",
                    text: `Grove: ${grove.name}\nID: ${grove.id}\nPlants: ${output.grove.plantCount}\nCreated: ${grove.created_at}`,
                },
            ],
            structuredContent: output,
        };
    });
    // Create grove
    server.registerTool("create_grove", {
        title: "Create Grove",
        description: "Create a new grove",
        inputSchema: {
            name: z.string().min(1).describe("Name for the new grove"),
        },
        outputSchema: {
            grove: z.object({
                id: z.string(),
                name: z.string(),
            }),
        },
    }, async ({ name }) => {
        requireAuth();
        const client = getClient();
        const id = generateGroveId(name);
        const { data: grove, error } = await client
            .from("groves")
            .insert({ id, name })
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create grove: ${error.message}`);
        }
        const output = {
            grove: {
                id: grove.id,
                name: grove.name,
            },
        };
        return {
            content: [
                {
                    type: "text",
                    text: `Created grove "${grove.name}" with ID: ${grove.id}`,
                },
            ],
            structuredContent: output,
        };
    });
    // Update grove
    server.registerTool("update_grove", {
        title: "Update Grove",
        description: "Update a grove's name or cover photo",
        inputSchema: {
            groveId: z.string().describe("The grove ID to update"),
            name: z.string().optional().describe("New name for the grove"),
            coverPhoto: z.string().optional().describe("URL for cover photo"),
        },
        outputSchema: {
            grove: z.object({
                id: z.string(),
                name: z.string(),
            }),
        },
    }, async ({ groveId, name, coverPhoto }) => {
        requireAuth();
        const client = getClient();
        const updates = {};
        if (name)
            updates.name = name;
        if (coverPhoto)
            updates.cover_photo = coverPhoto;
        if (Object.keys(updates).length === 0) {
            throw new Error("No updates provided");
        }
        const { data: grove, error } = await client
            .from("groves")
            .update(updates)
            .eq("id", groveId)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to update grove: ${error.message}`);
        }
        const output = {
            grove: {
                id: grove.id,
                name: grove.name,
            },
        };
        return {
            content: [
                {
                    type: "text",
                    text: `Updated grove "${grove.name}"`,
                },
            ],
            structuredContent: output,
        };
    });
    // Delete grove
    server.registerTool("delete_grove", {
        title: "Delete Grove",
        description: "Delete a grove and all its plants",
        inputSchema: {
            groveId: z.string().describe("The grove ID to delete"),
            confirm: z.boolean().describe("Set to true to confirm deletion"),
        },
        outputSchema: {
            success: z.boolean(),
            message: z.string(),
        },
    }, async ({ groveId, confirm }) => {
        requireAuth();
        if (!confirm) {
            throw new Error("Deletion not confirmed. Set confirm=true to delete the grove and all its plants.");
        }
        const client = getClient();
        const { error } = await client.from("groves").delete().eq("id", groveId);
        if (error) {
            throw new Error(`Failed to delete grove: ${error.message}`);
        }
        const output = {
            success: true,
            message: `Deleted grove ${groveId}`,
        };
        return {
            content: [{ type: "text", text: output.message }],
            structuredContent: output,
        };
    });
}
