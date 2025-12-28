#!/usr/bin/env node
/**
 * Plangrove MCP Server
 *
 * An MCP server for managing plant groves from Claude Code.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAuthTools } from "./tools/auth.js";
import { registerGroveTools } from "./tools/groves.js";
import { registerPlantTools } from "./tools/plants.js";
import { registerActivityTools } from "./tools/activities.js";
const server = new McpServer({
    name: "plangrove",
    version: "0.1.0",
});
// Register all tools
registerAuthTools(server);
registerGroveTools(server);
registerPlantTools(server);
registerActivityTools(server);
// Connect via stdio
const transport = new StdioServerTransport();
await server.connect(transport);
