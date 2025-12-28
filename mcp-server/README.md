# @plangrove/mcp

MCP server for Plangrove - manage your plant groves from Claude Code.

## Installation

### Option 1: Use with npx (recommended)

Add to your Claude Code settings (`~/.claude/settings.json`):

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

### Option 2: Global install

```bash
npm install -g @plangrove/mcp
```

Then add to your Claude Code settings:

```json
{
  "mcpServers": {
    "plangrove": {
      "command": "plangrove-mcp"
    }
  }
}
```

## Usage

Once configured, restart Claude Code. The following tools will be available:

### Authentication

- **login** - Sign in with your Plangrove email and password
- **logout** - Sign out and clear stored credentials
- **whoami** - Show the current user

### Groves

- **list_groves** - List all your groves
- **get_grove** - Get details of a specific grove
- **create_grove** - Create a new grove
- **update_grove** - Update a grove's name or cover photo
- **delete_grove** - Delete a grove and all its plants

### Plants

- **list_plants** - List all plants in a grove
- **get_plant** - Get details of a specific plant
- **create_plant** - Add a new plant to a grove
- **update_plant** - Update a plant's details
- **delete_plant** - Remove a plant
- **water_plant** - Record watering (updates streak)

### Activity

- **get_watering_history** - Get recent watering events
- **get_grove_stats** - Get grove analytics and statistics

## Examples

```
# First, login to your account
> login with email "you@example.com" password "yourpassword"

# List your groves
> list_groves

# Add a plant
> create_plant in grove "my-garden-abc1" name "Monstera" type "Monstera deliciosa" wateringInterval 7

# Water a plant
> water_plant "plant-id-here"

# Check grove stats
> get_grove_stats for "my-garden-abc1"
```

## Security

- Credentials are stored locally in `~/.plangrove/config.json`
- File permissions are set to 600 (owner read/write only)
- Session tokens are refreshed automatically
- No service role keys are used - you authenticate as yourself

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build
pnpm build
```

## License

MIT
