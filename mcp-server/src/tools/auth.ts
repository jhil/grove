/**
 * Auth tools for Plangrove MCP server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import { signIn, signOut, getCurrentUser } from "../lib/supabase.js";
import { clearConfig, isLoggedIn } from "../lib/config.js";

export function registerAuthTools(server: McpServer): void {
  // Login tool
  server.registerTool(
    "login",
    {
      title: "Login to Plangrove",
      description: "Authenticate with your Plangrove account using email and password",
      inputSchema: {
        email: z.string().email().describe("Your Plangrove email address"),
        password: z.string().min(1).describe("Your Plangrove password"),
      },
      outputSchema: {
        success: z.boolean(),
        message: z.string(),
        userId: z.string().optional(),
        displayName: z.string().optional(),
      },
    },
    async ({ email, password }) => {
      const result = await signIn(email, password);

      if (result.success) {
        const output = {
          success: true,
          message: `Logged in as ${result.displayName || email}`,
          userId: result.userId,
          displayName: result.displayName,
        };
        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          structuredContent: output,
        };
      } else {
        const output = {
          success: false,
          message: result.error || "Login failed",
        };
        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
          structuredContent: output,
        };
      }
    }
  );

  // Logout tool
  server.registerTool(
    "logout",
    {
      title: "Logout from Plangrove",
      description: "Sign out and clear stored credentials",
      inputSchema: {},
      outputSchema: {
        success: z.boolean(),
        message: z.string(),
      },
    },
    async () => {
      await signOut();
      clearConfig();

      const output = {
        success: true,
        message: "Logged out successfully",
      };
      return {
        content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        structuredContent: output,
      };
    }
  );

  // Whoami tool
  server.registerTool(
    "whoami",
    {
      title: "Current User",
      description: "Show the currently logged in user",
      inputSchema: {},
      outputSchema: {
        loggedIn: z.boolean(),
        userId: z.string().optional(),
        email: z.string().optional(),
        displayName: z.string().optional(),
      },
    },
    async () => {
      if (!isLoggedIn()) {
        const output = {
          loggedIn: false,
        };
        return {
          content: [{ type: "text", text: "Not logged in. Use the login tool to authenticate." }],
          structuredContent: output,
        };
      }

      const user = await getCurrentUser();
      if (!user) {
        const output = {
          loggedIn: false,
        };
        return {
          content: [{ type: "text", text: "Session expired. Please login again." }],
          structuredContent: output,
        };
      }

      const output = {
        loggedIn: true,
        userId: user.userId,
        email: user.email,
        displayName: user.displayName || undefined,
      };
      return {
        content: [
          {
            type: "text",
            text: `Logged in as ${user.displayName || user.email} (${user.userId})`,
          },
        ],
        structuredContent: output,
      };
    }
  );
}
