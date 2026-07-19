"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  X
} from "lucide-react";
import { QivrenLogo } from "@/components/logo";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";
import type { AppLanguage, ChatConversation } from "@/types/chat";

interface SidebarProps {
  chats: ChatConversation[];
  activeChatId: string | null;
  language: AppLanguage;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
}

export function Sidebar(props: SidebarProps) {
  return (
    <>
      <DesktopSidebar {...props} />
      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm transition lg:hidden",
          props.mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
        onMouseDown={props.onCloseMobile}
        aria-hidden={!props.mobileOpen}
      >
        <div
          className={cn(
            "h-full w-[min(88vw,340px)] transform bg-white shadow-2xl transition duration-200 dark:bg-slate-950",
            props.mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <SidebarContents {...props} collapsed={false} mobile />
        </div>
      </div>
    </>
  );
}

function DesktopSidebar(props: SidebarProps) {
  return (
    <aside
      className={cn(
        "relative hidden h-dvh shrink-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl transition-[width] duration-200 dark:border-white/10 dark:bg-slate-950/85 lg:block",
        props.collapsed ? "w-[78px]" : "w-[300px]"
      )}
    >
      <SidebarContents {...props} mobile={false} />
    </aside>
  );
}

function SidebarContents({
  chats,
  activeChatId,
  language,
  collapsed,
  mobile,
  onToggleCollapsed,
  onCloseMobile,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onOpenSettings
}: SidebarProps & { mobile: boolean }) {
  const copy = t(language);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return chats;
    return chats.filter((chat) =>
      `${chat.title} ${chat.messages.map((message) => message.content).join(" ")}`
        .toLocaleLowerCase()
        .includes(normalized)
    );
  }, [chats, query]);

  function beginRename(chat: ChatConversation) {
    setMenuId(null);
    setEditingId(chat.id);
    setEditingTitle(chat.title);
  }

  function saveRename() {
    if (editingId && editingTitle.trim()) onRenameChat(editingId, editingTitle.trim());
    setEditingId(null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-3">
      <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
        <QivrenLogo compact={collapsed} />
        {mobile ? (
          <button type="button" onClick={onCloseMobile} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close menu">
            <X className="size-5" />
          </button>
        ) : !collapsed ? (
          <button type="button" onClick={onToggleCollapsed} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" aria-label={copy.collapse}>
            <ChevronLeft className="size-5" />
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className={cn(
          "mt-5 flex h-11 items-center rounded-2xl bg-slate-950 font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-violet-700 dark:bg-white dark:text-slate-950 dark:hover:bg-violet-200",
          collapsed ? "justify-center px-0" : "gap-2 px-4"
        )}
        aria-label={copy.newChat}
        title={collapsed ? copy.newChat : undefined}
      >
        <Plus className="size-4" />
        {!collapsed && <span>{copy.newChat}</span>}
      </button>

      {!collapsed && (
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchChats}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            aria-label={copy.searchChats}
          />
        </div>
      )}

      <div className={cn("mt-4 min-h-0 flex-1 overflow-y-auto", collapsed ? "space-y-2" : "space-y-1")}>
        {filtered.length === 0 && !collapsed ? (
          <div className="px-3 py-8 text-center text-sm text-slate-400">{copy.noChats}</div>
        ) : (
          filtered.map((chat) => (
            <div key={chat.id} className="group relative">
              {editingId === chat.id && !collapsed ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveRename();
                  }}
                  className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/10"
                >
                  <input
                    autoFocus
                    value={editingTitle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                    onBlur={saveRename}
                    maxLength={80}
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none dark:text-white"
                    aria-label={copy.rename}
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onSelectChat(chat.id);
                    if (mobile) onCloseMobile();
                  }}
                  className={cn(
                    "flex w-full items-center rounded-xl text-left text-sm transition",
                    collapsed ? "h-11 justify-center" : "h-11 gap-2.5 px-3 pr-10",
                    activeChatId === chat.id
                      ? "bg-violet-100 font-semibold text-violet-800 dark:bg-violet-500/15 dark:text-violet-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                  )}
                  title={collapsed ? chat.title : undefined}
                  aria-current={activeChatId === chat.id ? "page" : undefined}
                >
                  <MessageSquare className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{chat.title}</span>}
                </button>
              )}

              {!collapsed && editingId !== chat.id && (
                <button
                  type="button"
                  onClick={() => setMenuId(menuId === chat.id ? null : chat.id)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-white hover:text-slate-700 focus:opacity-100 group-hover:opacity-100 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label={`Actions for ${chat.title}`}
                  aria-expanded={menuId === chat.id}
                >
                  <MoreHorizontal className="size-4" />
                </button>
              )}

              {menuId === chat.id && !collapsed && (
                <div className="absolute right-2 top-10 z-20 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
                  <button type="button" onClick={() => beginRename(chat)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10">
                    <Pencil className="size-3.5" /> {copy.rename}
                  </button>
                  <button type="button" onClick={() => { setMenuId(null); onDeleteChat(chat.id); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                    <Trash2 className="size-3.5" /> {copy.delete}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-3 border-t border-slate-200 pt-3 dark:border-white/10">
        <SidebarButton collapsed={collapsed} icon={Settings} label={copy.settings} onClick={onOpenSettings} />
        <Link
          href="/about"
          className={cn(
            "mt-1 flex h-10 items-center rounded-xl text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
            collapsed ? "justify-center" : "gap-3 px-3"
          )}
          title={collapsed ? copy.about : undefined}
        >
          <Info className="size-4 shrink-0" />
          {!collapsed && <span>{copy.about}</span>}
        </Link>
        {!mobile && collapsed && (
          <button type="button" onClick={onToggleCollapsed} className="mt-2 flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5" aria-label={copy.expand} title={copy.expand}>
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function SidebarButton({ collapsed, icon: Icon, label, onClick }: { collapsed: boolean; icon: typeof Menu; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-full items-center rounded-xl text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white",
        collapsed ? "justify-center" : "gap-3 px-3"
      )}
      title={collapsed ? label : undefined}
      aria-label={label}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
