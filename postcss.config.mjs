import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ChatConversation } from "@/types/chat";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createId(prefix = "id") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function createChat(): ChatConversation {
  const now = new Date().toISOString();
  return {
    id: createId("chat"),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}

export function generateChatTitle(content: string) {
  const compact = content.replace(/\s+/g, " ").trim();
  if (!compact) return "New chat";
  return compact.length > 48 ? `${compact.slice(0, 48).trim()}…` : compact;
}

export function formatTime(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));
}

export function exportMarkdown(chat: ChatConversation) {
  const lines = [`# ${chat.title}`, "", `Exported from QIVREN`, ""];
  for (const message of chat.messages) {
    lines.push(`## ${message.role === "user" ? "You" : "QIVREN"}`, "", message.content, "");
  }
  return lines.join("\n");
}

export function downloadText(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
