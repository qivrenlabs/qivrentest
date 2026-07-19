import type { AppSettings } from "@/types/chat";

export const APP_NAME = "QIVREN";
export const PUBLIC_MODEL = "Qivren 1.0 Sera — Preview";
export const INFRASTRUCTURE = "Vireqon Intelligence";
export const APP_VERSION = "QIVREN Preview";
export const STORAGE_KEY = "qivren:chats:v1";
export const SETTINGS_KEY = "qivren:settings:v1";
export const MAX_MESSAGE_LENGTH = 12_000;

export const DEFAULT_SETTINGS: AppSettings = {
  language: "en",
  theme: "system",
  responseStyle: "balanced",
  enterToSend: true,
  showTimestamps: false
};
