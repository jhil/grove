/**
 * TypeScript types for Google Smart Home API.
 *
 * These types define the request and response structures for
 * the Smart Home fulfillment webhook.
 */

// Base intent request structure
export interface SmartHomeRequest {
  requestId: string;
  inputs: SmartHomeInput[];
}

export interface SmartHomeInput {
  intent: string;
  payload?: Record<string, unknown>;
}

// SYNC Intent Types
export interface SyncRequest extends SmartHomeRequest {
  inputs: [
    {
      intent: "action.devices.SYNC";
    }
  ];
}

export interface SyncResponse {
  requestId: string;
  payload: {
    agentUserId: string;
    devices: GoogleDevice[];
    errorCode?: string;
    debugString?: string;
  };
}

export interface GoogleDevice {
  id: string;
  type: string;
  traits: string[];
  name: {
    name: string;
    defaultNames?: string[];
    nicknames?: string[];
  };
  willReportState: boolean;
  roomHint?: string;
  deviceInfo?: {
    manufacturer: string;
    model: string;
    hwVersion?: string;
    swVersion?: string;
  };
  attributes?: Record<string, unknown>;
  customData?: {
    plantId: string;
    groveId: string;
  };
}

// QUERY Intent Types
export interface QueryRequest extends SmartHomeRequest {
  inputs: [
    {
      intent: "action.devices.QUERY";
      payload: {
        devices: QueryDevice[];
      };
    }
  ];
}

export interface QueryDevice {
  id: string;
  customData?: {
    plantId: string;
    groveId: string;
  };
}

export interface QueryResponse {
  requestId: string;
  payload: {
    devices: Record<string, DeviceState>;
  };
}

export interface DeviceState {
  online: boolean;
  status: "SUCCESS" | "OFFLINE" | "EXCEPTIONS" | "ERROR";
  errorCode?: string;
  // StartStop trait states
  isRunning?: boolean;
  isPaused?: boolean;
  // Custom state for plant watering status
  currentRunCycle?: Array<{
    currentCycle: string;
    lang: string;
  }>;
  currentTotalRemainingTime?: number;
  currentCycleRemainingTime?: number;
}

// EXECUTE Intent Types
export interface ExecuteRequest extends SmartHomeRequest {
  inputs: [
    {
      intent: "action.devices.EXECUTE";
      payload: {
        commands: ExecuteCommand[];
      };
    }
  ];
}

export interface ExecuteCommand {
  devices: ExecuteDevice[];
  execution: Execution[];
}

export interface ExecuteDevice {
  id: string;
  customData?: {
    plantId: string;
    groveId: string;
  };
}

export interface Execution {
  command: string;
  params?: Record<string, unknown>;
}

export interface ExecuteResponse {
  requestId: string;
  payload: {
    commands: ExecuteResponseCommand[];
  };
}

export interface ExecuteResponseCommand {
  ids: string[];
  status: "SUCCESS" | "PENDING" | "OFFLINE" | "EXCEPTIONS" | "ERROR";
  states?: DeviceState;
  errorCode?: string;
  debugString?: string;
}

// DISCONNECT Intent Types
export interface DisconnectRequest extends SmartHomeRequest {
  inputs: [
    {
      intent: "action.devices.DISCONNECT";
    }
  ];
}

export interface DisconnectResponse {
  requestId: string;
  payload: Record<string, never>;
}

// Union type for all requests
export type SmartHomeIntentRequest =
  | SyncRequest
  | QueryRequest
  | ExecuteRequest
  | DisconnectRequest;

// Union type for all responses
export type SmartHomeIntentResponse =
  | SyncResponse
  | QueryResponse
  | ExecuteResponse
  | DisconnectResponse;

// Error codes from Google Smart Home API
export type SmartHomeErrorCode =
  | "authExpired"
  | "authFailure"
  | "deviceOffline"
  | "timeout"
  | "deviceTurnedOff"
  | "deviceNotFound"
  | "valueOutOfRange"
  | "notSupported"
  | "protocolError"
  | "unknownError"
  | "transientError"
  | "deviceJammingDetected"
  | "functionNotSupported"
  | "commandInsertFailed"
  | "actionNotAvailable"
  | "relinkRequired";
