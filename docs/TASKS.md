# Human Tasks

This file tracks tasks that need to be completed by the user (not automated by Claude Code).

## Pending Tasks

### 2025-12-27
- [ ] **[T-005]** Test security headers on production after deploy (use securityheaders.com)
- [ ] **[T-006]** Run Lighthouse audit and document Core Web Vitals baseline
- [ ] **[T-007]** Set up E2E test infrastructure with Playwright (`npx playwright install`)
- [x] **[T-008]** Publish MCP server to npm (see instructions below)
- [ ] **[T-009]** Test MCP server with Claude Code (restart Claude Code, run `whoami`)
- [ ] **[T-010]** Test full flow: login, list_groves, water_plant

---

## Completed Tasks

### 2025-12-27
- [x] **[T-000]** Configure Supabase Auth redirect URL to `https://plangrove.app`
- [x] **[T-001]** Run Migration 001: Care Streaks & Milestones
- [x] **[T-002]** Run Migration 002: Plant Growth Timeline
- [x] **[T-003]** Deploy to Cloudflare (https://plangrove.jahilnbrand.workers.dev)
- [x] **[T-004]** Verify Supabase Auth redirect URLs include `/auth/callback`

---

## Migration Reference

All SQL migrations are documented in `docs/MIGRATIONS.md` with full SQL scripts.

| Task ID | Migration | Description |
|---------|-----------|-------------|
| T-001 | Migration 001 | streak_count, best_streak, streak_started_at, birthday fields |
| T-002 | Migration 002 | plant_photos table for growth timeline |

---

## MCP Server Publishing (T-008)

### Prerequisites
- npm account: `jeffand`
- MCP server built: `pnpm --filter @plangrove/mcp build`

### Local Testing (T-009)
Add to `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "plangrove": {
      "command": "node",
      "args": ["/Users/jeffand/dev/plangrove/mcp-server/dist/index.js"]
    }
  }
}
```
Restart Claude Code, then test: `login`, `list_groves`, `water_plant`, etc.

### Publishing Steps (T-008)
```bash
cd mcp-server
npm login                    # Login as jeffand
npm publish --access public  # Publish @plangrove/mcp
```

### Post-Publish Testing (T-010)
Update `~/.claude/settings.json` to use npx:
```json
{
  "mcpServers": {
    "plangrove": {
      "command": "npx",
      "args": ["@plangrove/mcp"]
    }
  }
}
```

### Available Tools
| Category | Tools |
|----------|-------|
| Auth | `login`, `logout`, `whoami` |
| Groves | `list_groves`, `get_grove`, `create_grove`, `update_grove`, `delete_grove` |
| Plants | `list_plants`, `get_plant`, `create_plant`, `update_plant`, `delete_plant`, `water_plant` |
| Activity | `get_watering_history`, `get_grove_stats` |

---

## Notes

- After running migrations, test the feature locally before deploying
- Environment variables should already be set in Cloudflare dashboard
- Auth callback route is at `/auth/callback`
- Profile page is at `/profile`
