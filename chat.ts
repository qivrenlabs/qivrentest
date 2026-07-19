"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  Check,
  Copy,
  Download,
  Menu,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  RotateCcw,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Composer } from "@/components/composer";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { SettingsPanel } from "@/components/settings-panel";
import { Sidebar } from "@/components/sidebar";
import {
  DEFAULT_SETTINGS,
  PUBLIC_MODEL,
  SETTINGS_KEY,
  STORAGE_KEY
} from "@/lib/constants";
import { t } from "@/lib/translations";
import {
  cn,
  createChat,
  createId,
  downloadText,
  exportMarkdown,
  formatTime,
  generateChatTitle
} from "@/lib/utils";
import type {
  AppSettings,
  ChatApiError,
  ChatConversation,
  ChatErrorCode,
  ChatMessage
} from "@/types/chat";

type ConfirmState =
  | { type: "clear" }
  | { type: "chat"; chatId: string }
  | { type: "message"; chatId: string; messageId: string }
  | null;

export function ChatApp() {
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stoppedByUserRef = useRef(false);

  const copy = t(settings.language);
  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? null,
    [activeChatId, chats]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const storedChats = localStorage.getItem(STORAGE_KEY);
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        const parsedChats = storedChats ? (JSON.parse(storedChats) as ChatConversation[]) : [];
        const parsedSettings = storedSettings ? (JSON.parse(storedSettings) as Partial<AppSettings>) : {};
        const safeChats = Array.isArray(parsedChats) ? parsedChats : [];
        setChats(safeChats);
        setActiveChatId(safeChats[0]?.id ?? null);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      } catch {
        setChats([]);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = settings.theme === "dark" || (settings.theme === "system" && media.matches);
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [settings.theme]);

  const updateChat = useCallback((chatId: string, updater: (chat: ChatConversation) => ChatConversation) => {
    setChats((current) =>
      current.map((chat) => (chat.id === chatId ? updater(chat) : chat))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    );
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const element = scrollRef.current;
    if (element) element.scrollTo({ top: element.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    if (!activeChat?.messages.length) return;
    const timer = window.setTimeout(() => scrollToBottom(streaming ? "auto" : "smooth"), 20);
    return () => window.clearTimeout(timer);
  }, [activeChat?.messages, scrollToBottom, streaming]);

  function newChat() {
    const chat = { ...createChat(), title: copy.newChat };
    setChats((current) => [chat, ...current]);
    setActiveChatId(chat.id);
    setMobileOpen(false);
  }

  function renameChat(chatId: string, title: string) {
    updateChat(chatId, (chat) => ({ ...chat, title: title.slice(0, 80), updatedAt: new Date().toISOString() }));
  }

  function executeConfirm() {
    if (!confirmState) return;
    if (confirmState.type === "clear") {
      abortRef.current?.abort();
      setChats([]);
      setActiveChatId(null);
      setStreaming(false);
    }
    if (confirmState.type === "chat") {
      setChats((current) => {
        const next = current.filter((chat) => chat.id !== confirmState.chatId);
        if (activeChatId === confirmState.chatId) setActiveChatId(next[0]?.id ?? null);
        return next;
      });
    }
    if (confirmState.type === "message") {
      updateChat(confirmState.chatId, (chat) => {
        const messages = chat.messages.filter((message) => message.id !== confirmState.messageId);
        const firstUser = messages.find((message) => message.role === "user");
        return {
          ...chat,
          messages,
          title: firstUser ? generateChatTitle(firstUser.content) : copy.newChat,
          updatedAt: new Date().toISOString()
        };
      });
    }
    setConfirmState(null);
  }

  function ensureChat() {
    if (activeChat) return activeChat;
    const chat = { ...createChat(), title: copy.newChat };
    setChats((current) => [chat, ...current]);
    setActiveChatId(chat.id);
    return chat;
  }

  async function streamResponse(chatId: string, requestMessages: ChatMessage[], assistantId: string) {
    const controller = new AbortController();
    abortRef.current = controller;
    stoppedByUserRef.current = false;
    setStreaming(true);
    let accumulated = "";
    let streamError: ChatErrorCode | null = null;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: requestMessages.map(({ role, content }) => ({ role, content })),
          language: settings.language,
          responseStyle: settings.responseStyle
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        let code: ChatErrorCode = "SERVER_ERROR";
        try {
          const payload = (await response.json()) as Partial<ChatApiError>;
          if (payload.code && payload.code in copy.errors) code = payload.code;
        } catch {
          code = response.status === 429 ? "RATE_LIMITED" : "SERVER_ERROR";
        }
        throw Object.assign(new Error("Safe API error"), { code });
      }

      if (!response.body) {
        throw Object.assign(new Error("Missing stream"), { code: "EMPTY_RESPONSE" as ChatErrorCode });
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const processEvent = (block: string) => {
        const lines = block.split("\n");
        const eventName = lines.find((line) => line.startsWith("event:"))?.slice(6).trim();
        const data = lines
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim())
          .join("\n");
        if (!data) return;

        if (eventName === "delta") {
          const parsed = JSON.parse(data) as { text?: string };
          if (!parsed.text) return;
          accumulated += parsed.text;
          updateChat(chatId, (chat) => ({
            ...chat,
            updatedAt: new Date().toISOString(),
            messages: chat.messages.map((message) =>
              message.id === assistantId
                ? { ...message, content: accumulated, status: "streaming" }
                : message
            )
          }));
        }

        if (eventName === "error") {
          const parsed = JSON.parse(data) as { code?: ChatErrorCode };
          streamError = parsed.code ?? "SERVER_ERROR";
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";
        for (const block of blocks) {
          if (block.trim()) processEvent(block.trim());
        }
      }
      if (buffer.trim()) processEvent(buffer.trim());

      if (streamError) {
        throw Object.assign(new Error("Stream error"), { code: streamError });
      }
      if (!accumulated.trim()) {
        throw Object.assign(new Error("Empty response"), { code: "EMPTY_RESPONSE" as ChatErrorCode });
      }

      updateChat(chatId, (chat) => ({
        ...chat,
        updatedAt: new Date().toISOString(),
        messages: chat.messages.map((message) =>
          message.id === assistantId ? { ...message, content: accumulated, status: "complete" } : message
        )
      }));
    } catch (error) {
      if (controller.signal.aborted && stoppedByUserRef.current) {
        updateChat(chatId, (chat) => ({
          ...chat,
          updatedAt: new Date().toISOString(),
          messages: accumulated
            ? chat.messages.map((message) =>
                message.id === assistantId ? { ...message, content: accumulated, status: "complete" } : message
              )
            : chat.messages.filter((message) => message.id !== assistantId)
        }));
      } else {
        const code =
          typeof error === "object" && error && "code" in error
            ? (error.code as ChatErrorCode)
            : controller.signal.aborted
              ? "REQUEST_TIMEOUT"
              : "NETWORK_ERROR";
        updateChat(chatId, (chat) => ({
          ...chat,
          updatedAt: new Date().toISOString(),
          messages: chat.messages.map((message) =>
            message.id === assistantId
              ? { ...message, content: copy.errors[code], status: "error", errorCode: code }
              : message
          )
        }));
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
    }
  }

  function sendMessage(content: string) {
    if (streaming) return;
    const chat = ensureChat();
    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: createId("msg"),
      role: "user",
      content,
      createdAt: now,
      status: "complete"
    };
    const assistantMessage: ChatMessage = {
      id: createId("msg"),
      role: "assistant",
      content: "",
      createdAt: now,
      status: "streaming"
    };
    const requestMessages = [...chat.messages, userMessage].filter((message) => message.status !== "error");
    const isFirstUserMessage = !chat.messages.some((message) => message.role === "user");

    updateChat(chat.id, (current) => ({
      ...current,
      title: isFirstUserMessage ? generateChatTitle(content) : current.title,
      updatedAt: now,
      messages: [...current.messages, userMessage, assistantMessage]
    }));
    void streamResponse(chat.id, requestMessages, assistantMessage.id);
  }

  function stopGeneration() {
    stoppedByUserRef.current = true;
    abortRef.current?.abort();
  }

  function regenerate(messageId: string) {
    if (!activeChat || streaming) return;
    const index = activeChat.messages.findIndex((message) => message.id === messageId);
    if (index < 0) return;
    const context = activeChat.messages.slice(0, index).filter((message) => message.status !== "error");
    if (context.at(-1)?.role !== "user") return;
    const assistantMessage: ChatMessage = {
      id: createId("msg"),
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      status: "streaming"
    };
    updateChat(activeChat.id, (chat) => ({
      ...chat,
      updatedAt: new Date().toISOString(),
      messages: [...context, assistantMessage]
    }));
    void streamResponse(activeChat.id, context, assistantMessage.id);
  }

  function saveEditedMessage(messageId: string, content: string) {
    if (!activeChat || streaming || !content.trim()) return;
    const index = activeChat.messages.findIndex((message) => message.id === messageId);
    if (index < 0) return;
    const edited: ChatMessage = {
      ...activeChat.messages[index],
      content: content.trim(),
      createdAt: new Date().toISOString(),
      status: "complete"
    };
    const context = [...activeChat.messages.slice(0, index), edited].filter((message) => message.status !== "error");
    const assistantMessage: ChatMessage = {
      id: createId("msg"),
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      status: "streaming"
    };
    updateChat(activeChat.id, (chat) => ({
      ...chat,
      title: index === 0 ? generateChatTitle(edited.content) : chat.title,
      updatedAt: new Date().toISOString(),
      messages: [...context, assistantMessage]
    }));
    setEditingMessageId(null);
    void streamResponse(activeChat.id, context, assistantMessage.id);
  }

  async function copyMessage(message: ChatMessage) {
    await navigator.clipboard.writeText(message.content);
    setCopiedMessageId(message.id);
    window.setTimeout(() => setCopiedMessageId(null), 1400);
  }

  function exportChat(format: "md" | "json") {
    if (!activeChat) return;
    const safeName = activeChat.title.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 50) || "qivren-chat";
    if (format === "md") {
      downloadText(`${safeName}.md`, exportMarkdown(activeChat), "text/markdown;charset=utf-8");
    } else {
      downloadText(`${safeName}.json`, JSON.stringify(activeChat, null, 2), "application/json;charset=utf-8");
    }
    setExportOpen(false);
  }

  const confirmCopy = confirmState?.type === "clear"
    ? { title: copy.clearAllTitle, body: copy.clearAllBody }
    : confirmState?.type === "message"
      ? { title: copy.deleteMessageTitle, body: copy.deleteMessageBody }
      : { title: copy.delete, body: "This conversation will be removed from local history." };

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#f7f7fb] text-slate-950 dark:bg-[#080a12] dark:text-white">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        language={settings.language}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
        onNewChat={newChat}
        onSelectChat={setActiveChatId}
        onRenameChat={renameChat}
        onDeleteChat={(chatId) => setConfirmState({ type: "chat", chatId })}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/70 px-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-900 dark:text-white">{activeChat?.title ?? copy.newChat}</div>
              <div className="mt-0.5 hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-600 dark:text-violet-300 sm:flex">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {PUBLIC_MODEL}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {activeChat?.messages.length ? (
              <div className="relative">
                <button type="button" onClick={() => setExportOpen((value) => !value)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Export conversation" aria-expanded={exportOpen}>
                  <Download className="size-4.5" />
                </button>
                {exportOpen && (
                  <div className="absolute right-0 top-11 z-30 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900">
                    <button type="button" onClick={() => exportChat("md")} className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10">{copy.exportMarkdown}</button>
                    <button type="button" onClick={() => exportChat("json")} className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10">{copy.exportJson}</button>
                  </div>
                )}
              </div>
            ) : null}
            <button type="button" onClick={() => setSettingsOpen(true)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white" aria-label={copy.settings}>
              <Settings className="size-4.5" />
            </button>
          </div>
        </header>

        <div
          ref={scrollRef}
          onScroll={(event) => {
            const target = event.currentTarget;
            setShowScrollButton(target.scrollHeight - target.scrollTop - target.clientHeight > 240);
          }}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          {!hydrated ? (
            <div className="grid min-h-full place-items-center">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="size-2 animate-pulse-soft rounded-full bg-violet-500" />
                Loading QIVREN…
              </div>
            </div>
          ) : !activeChat?.messages.length ? (
            <WelcomeScreen copy={copy} onPrompt={sendMessage} />
          ) : (
            <div className="mx-auto w-full max-w-4xl px-3 py-7 sm:px-5 sm:py-10">
              {activeChat.messages.map((message, index) => (
                <MessageRow
                  key={message.id}
                  message={message}
                  language={settings.language}
                  showTimestamp={settings.showTimestamps}
                  isLast={index === activeChat.messages.length - 1}
                  editing={editingMessageId === message.id}
                  copied={copiedMessageId === message.id}
                  copyLabels={copy}
                  onCopy={() => void copyMessage(message)}
                  onEdit={() => setEditingMessageId(message.id)}
                  onCancelEdit={() => setEditingMessageId(null)}
                  onSaveEdit={(content) => saveEditedMessage(message.id, content)}
                  onDelete={() => setConfirmState({ type: "message", chatId: activeChat.id, messageId: message.id })}
                  onRegenerate={() => regenerate(message.id)}
                />
              ))}
            </div>
          )}
        </div>

        {showScrollButton && (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="absolute bottom-32 left-1/2 z-20 grid size-10 -translate-x-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
            aria-label={copy.scrollBottom}
            title={copy.scrollBottom}
          >
            <ArrowDown className="size-4" />
          </button>
        )}

        <div className="shrink-0 bg-gradient-to-t from-[#f7f7fb] via-[#f7f7fb] to-transparent pt-3 dark:from-[#080a12] dark:via-[#080a12]">
          <Composer
            placeholder={copy.composerPlaceholder}
            sendLabel={copy.send}
            stopLabel={copy.stop}
            enterToSend={settings.enterToSend}
            streaming={streaming}
            onSend={sendMessage}
            onStop={stopGeneration}
          />
        </div>
      </main>

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
        onClearHistory={() => {
          setSettingsOpen(false);
          setConfirmState({ type: "clear" });
        }}
      />

      <ConfirmDialog
        open={confirmState !== null}
        title={confirmCopy.title}
        body={confirmCopy.body}
        cancelLabel={copy.cancel}
        confirmLabel={copy.confirm}
        onCancel={() => setConfirmState(null)}
        onConfirm={executeConfirm}
      />
    </div>
  );
}

function WelcomeScreen({ copy, onPrompt }: { copy: ReturnType<typeof t>; onPrompt: (prompt: string) => void }) {
  return (
    <section className="mx-auto flex min-h-full w-full max-w-4xl flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-[22px] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-cyan-400 text-white shadow-2xl shadow-violet-500/20">
          <Sparkles className="size-7" />
        </div>
        <h1 className="mt-6 bg-gradient-to-r from-slate-950 via-violet-800 to-slate-700 bg-clip-text text-3xl font-black tracking-tight text-transparent dark:from-white dark:via-violet-200 dark:to-slate-300 sm:text-5xl">
          {copy.welcomeTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">{copy.welcomeSubtitle}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200">
          <span className="size-1.5 rounded-full bg-violet-500" />
          {PUBLIC_MODEL}
        </div>
      </div>

      <div className="mx-auto mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {copy.examplePrompts.map((prompt, index) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPrompt(prompt)}
            className="group flex min-h-24 items-start gap-3 rounded-3xl border border-slate-200 bg-white/70 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-violet-500/40"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-black text-slate-500 transition group-hover:bg-violet-100 group-hover:text-violet-700 dark:bg-white/10 dark:text-slate-300 dark:group-hover:bg-violet-500/20 dark:group-hover:text-violet-200">
              {index + 1}
            </span>
            <span className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{prompt}</span>
          </button>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-slate-400">{copy.modelPreview}</p>
    </section>
  );
}

interface MessageRowProps {
  message: ChatMessage;
  language: AppSettings["language"];
  showTimestamp: boolean;
  isLast: boolean;
  editing: boolean;
  copied: boolean;
  copyLabels: ReturnType<typeof t>;
  onCopy: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (content: string) => void;
  onDelete: () => void;
  onRegenerate: () => void;
}

function MessageRow({
  message,
  language,
  showTimestamp,
  isLast,
  editing,
  copied,
  copyLabels,
  onCopy,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onRegenerate
}: MessageRowProps) {
  const [editValue, setEditValue] = useState(message.content);
  const isUser = message.role === "user";


  return (
    <article className={cn("group/message mb-7 flex gap-3 sm:gap-4", isUser && "flex-row-reverse")}>
      {isUser ? (
        <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-950">Y</div>
      ) : (
        <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/15">
          <Sparkles className="size-4" />
        </div>
      )}

      <div className={cn("min-w-0 max-w-[min(100%,760px)]", isUser ? "items-end" : "items-start")}>
        {editing && isUser ? (
          <div className="w-[min(76vw,620px)] rounded-3xl border border-violet-300 bg-white p-3 shadow-lg dark:border-violet-500/40 dark:bg-slate-900">
            <textarea
              autoFocus
              value={editValue}
              onChange={(event) => setEditValue(event.target.value)}
              rows={4}
              className="w-full resize-y bg-transparent p-2 text-sm leading-6 text-slate-900 outline-none dark:text-white"
              aria-label={copyLabels.edit}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button type="button" onClick={onCancelEdit} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10">{copyLabels.cancel}</button>
              <button type="button" onClick={() => onSaveEdit(editValue)} disabled={!editValue.trim()} className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40">{copyLabels.save}</button>
            </div>
          </div>
        ) : isUser ? (
          <div className="rounded-[22px] rounded-tr-md bg-slate-900 px-4 py-3 text-[15px] leading-7 text-white shadow-sm dark:bg-slate-800">
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        ) : (
          <div className={cn("min-w-0", message.status === "error" && "rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10")}>
            {message.status === "streaming" && !message.content ? (
              <div className="flex h-8 items-center gap-1.5" aria-label="QIVREN is responding">
                <span className="size-2 animate-pulse-soft rounded-full bg-violet-500" />
                <span className="size-2 animate-pulse-soft rounded-full bg-violet-500 [animation-delay:150ms]" />
                <span className="size-2 animate-pulse-soft rounded-full bg-violet-500 [animation-delay:300ms]" />
              </div>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>
        )}

        <div className={cn("mt-2 flex min-h-7 items-center gap-1 text-slate-400 transition sm:opacity-0 sm:group-hover/message:opacity-100 sm:group-focus-within/message:opacity-100", isUser && "justify-end")}>
          {showTimestamp && <span className="mr-1 text-[10px]">{formatTime(message.createdAt, language)}</span>}
          <ActionButton label={copied ? copyLabels.copied : copyLabels.copy} onClick={onCopy} icon={copied ? Check : Copy} />
          {isUser && <ActionButton label={copyLabels.edit} onClick={onEdit} icon={Pencil} />}
          {!isUser && message.status !== "streaming" && isLast && <ActionButton label={message.status === "error" ? copyLabels.retry : copyLabels.regenerate} onClick={onRegenerate} icon={message.status === "error" ? RotateCcw : RefreshCw} />}
          {message.status !== "streaming" && <ActionButton label={copyLabels.delete} onClick={onDelete} icon={Trash2} danger />}
        </div>
      </div>
    </article>
  );
}

function ActionButton({ label, onClick, icon: Icon, danger = false }: { label: string; onClick: () => void; icon: typeof MoreHorizontal; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg p-1.5 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:hover:bg-white/10 dark:hover:text-white",
        danger && "hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
      )}
      aria-label={label}
      title={label}
    >
      <Icon className="size-3.5" />
    </button>
  );
}
