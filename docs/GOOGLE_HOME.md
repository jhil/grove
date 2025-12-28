# Google Home Integration

Plangrove integrates with Google Home, allowing users to check on their plants and record watering events using voice commands.

## Overview

The integration uses Google's Cloud-to-cloud Smart Home API. Plants appear as "Sprinkler" devices in Google Home, which allows users to:

- Check on plant watering status
- Water plants using voice commands
- Sync new plants to Google Home

## Voice Commands

Once connected, users can say:

| Command | What it does |
|---------|--------------|
| "Hey Google, check my plants" | Reports watering status for all plants |
| "Hey Google, water [plant name]" | Records a watering event for the plant |
| "Hey Google, is [plant name] thirsty?" | Reports if the plant needs watering |
| "Hey Google, sync my devices" | Refreshes the plant list from Plangrove |

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Google Home    │────▶│   Plangrove      │────▶│   Supabase      │
│  (Assistant)    │◀────│   API Routes     │◀────│   (PostgreSQL)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
    Voice Input           OAuth 2.0
    Intent Routing        Token Management
```

### Key Components

- **OAuth Server** (`/app/api/google-home/auth`, `/token`)
  - Handles account linking flow
  - Issues and refreshes access tokens

- **Fulfillment Webhook** (`/app/api/google-home/fulfillment`)
  - Handles SYNC, QUERY, EXECUTE, DISCONNECT intents
  - Routes to intent handlers in `/lib/google-home/intents/`

- **Device Conversion** (`/lib/google-home/devices.ts`)
  - Converts plants to Google Smart Home device format
  - Maps watering status to device states

- **Consent UI** (`/app/google-home/link`)
  - Allows users to select which groves to connect
  - Shown during account linking in Google Home app

## Setup Guide

### 1. Create Google Actions Project

1. Go to [Google Actions Console](https://console.actions.google.com/)
2. Click "New Project"
3. Enter a project name (e.g., "Plangrove")
4. Select "Smart Home" as the action type

### 2. Configure Account Linking

In the Actions Console:

1. Go to **Develop** > **Account Linking**
2. Select "OAuth" and "Authorization code"
3. Configure:
   - **Client ID**: Generate a unique ID (e.g., `plangrove-google-home`)
   - **Client Secret**: Generate a secure random string
   - **Authorization URL**: `https://plangrove.app/api/google-home/auth`
   - **Token URL**: `https://plangrove.app/api/google-home/token`
4. Save

### 3. Configure Fulfillment

1. Go to **Develop** > **Actions**
2. Click on the Smart Home action
3. Set **Fulfillment URL**: `https://plangrove.app/api/google-home/fulfillment`
4. Save

### 4. Set Environment Variables

Add these to your deployment environment:

```bash
GOOGLE_HOME_CLIENT_ID=<your-client-id-from-step-2>
GOOGLE_HOME_CLIENT_SECRET=<your-client-secret-from-step-2>
GOOGLE_HOME_JWT_SECRET=<random-32-char-string>
```

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

### 5. Deploy and Test

1. Deploy the updated application
2. Open Google Home app on your phone
3. Go to **Settings** > **Works with Google**
4. Search for "Plangrove" (or your action name)
5. Tap to link your account
6. Select groves to connect
7. Try a voice command!

## Database Schema

The integration adds two tables:

### `google_home_links`
Stores OAuth tokens and linked groves per user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles.id |
| agent_user_id | TEXT | Stable ID for Google Home |
| access_token | TEXT | Current access token |
| refresh_token | TEXT | Refresh token |
| token_expires_at | TIMESTAMPTZ | Token expiry time |
| linked_groves | TEXT[] | Array of grove IDs |

### `google_auth_codes`
Temporary storage for OAuth authorization codes.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| code | TEXT | Authorization code |
| user_id | UUID | References profiles.id |
| redirect_uri | TEXT | Google's redirect URI |
| expires_at | TIMESTAMPTZ | Code expiry (10 min) |
| used | BOOLEAN | Whether code was exchanged |

## Security

- Authorization codes expire after 10 minutes and are single-use
- Access tokens expire after 1 hour
- Refresh tokens are long-lived but can be revoked by unlinking
- All tokens use HMAC-SHA256 signing
- Row-Level Security (RLS) protects database access
- Client ID and redirect URI are validated strictly

## Troubleshooting

### "Failed to link account"
- Check that all environment variables are set correctly
- Verify the fulfillment URL is accessible
- Check the Actions Console for error logs

### Plants not appearing
- Make sure groves are selected during linking
- Try "Hey Google, sync my devices"
- Check that plants exist in the selected groves

### "Device not responding"
- Verify the access token hasn't expired
- Check Supabase logs for errors
- Ensure the plant still exists in the database

### Voice commands not working
- Make sure you're using the exact plant name
- Try adding the plant name as a nickname
- Check that the action is properly linked

## API Reference

### SYNC Response Device Format

```json
{
  "id": "plant-{uuid}",
  "type": "action.devices.types.SPRINKLER",
  "traits": ["action.devices.traits.StartStop"],
  "name": {
    "name": "Fern Fred",
    "nicknames": ["Fred", "Fern"]
  },
  "willReportState": false,
  "roomHint": "Living Room",
  "deviceInfo": {
    "manufacturer": "Plangrove",
    "model": "Virtual Plant",
    "swVersion": "1.0.0"
  },
  "attributes": {
    "pausable": false
  },
  "customData": {
    "plantId": "uuid",
    "groveId": "slug"
  }
}
```

### QUERY Response State Format

```json
{
  "online": true,
  "status": "SUCCESS",
  "isRunning": false,
  "currentRunCycle": [
    {
      "currentCycle": "Next watering in 3 days",
      "lang": "en"
    }
  ]
}
```

## Resources

- [Google Smart Home Documentation](https://developers.home.google.com/cloud-to-cloud)
- [Actions Console](https://console.actions.google.com/)
- [Smart Home Test Suite](https://developers.home.google.com/cloud-to-cloud/tools/smart-home-test-suite)
