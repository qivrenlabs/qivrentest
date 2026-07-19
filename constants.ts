"use client";

import { useEffect } from "react";
import { Database, Info, Moon, Settings2, ShieldCheck, Sun, X } from "lucide-react";
import { APP_VERSION, INFRASTRUCTURE, PUBLIC_MODEL } from "@/lib/constants";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";
import type { AppLanguage, AppSettings, AppTheme, ResponseStyle } from "@/types/chat";

interface SettingsPanelProps {
  open: boolean;
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
  onClose: () => void;
  onClearHistory: () => void;
}

const languages: Array<{ value: AppLanguage; label: string }> = [
  { value: "az", label: "Azərbaycan dili" },
  { value: "tr", label: "Türkçe" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" }
];

export function SettingsPanel({ open, settings, onChange, onClose, onClearHistory }: SettingsPanelProps) {
  const copy = t(settings.language);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const themes: Array<{ value: AppTheme; label: string; icon: typeof Sun }> = [
    { value: "system", label: copy.system, icon: Settings2 },
    { value: "light", label: copy.light, icon: Sun },
    { value: "dark", label: copy.dark, icon: Moon }
  ];
  const styles: Array<{ value: ResponseStyle; label: string }> = [
    { value: "concise", label: copy.concise },
    { value: "balanced", label: copy.balanced },
    { value: "detailed", label: copy.detailed }
  ];

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/45 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="h-full w-full max-w-lg animate-slide-up overflow-y-auto border-l border-white/20 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-950 sm:p-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              <Settings2 className="size-5" />
            </div>
            <h2 id="settings-title" className="text-xl font-black text-slate-950 dark:text-white">{copy.settings}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" aria-label={copy.close}>
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-8 space-y-7">
          <SettingGroup title={copy.language}>
            <select
              value={settings.language}
              onChange={(event) => onChange({ ...settings, language: event.target.value as AppLanguage })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none ring-violet-500 transition focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
              aria-label={copy.language}
            >
              {languages.map((language) => <option key={language.value} value={language.value}>{language.label}</option>)}
            </select>
          </SettingGroup>

          <SettingGroup title={copy.theme}>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ ...settings, theme: value })}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-xs font-semibold transition",
                    settings.theme === value
                      ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                  )}
                  aria-pressed={settings.theme === value}
                >
                  <Icon className="size-5" />
                  {label}
                </button>
              ))}
            </div>
          </SettingGroup>

          <SettingGroup title={copy.responseStyle}>
            <div className="grid grid-cols-3 gap-2">
              {styles.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ ...settings, responseStyle: value })}
                  className={cn(
                    "rounded-2xl border px-3 py-3 text-xs font-semibold transition",
                    settings.responseStyle === value
                      ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                  )}
                  aria-pressed={settings.responseStyle === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </SettingGroup>

          <SettingGroup title="Chat">
            <Toggle label={copy.enterToSend} checked={settings.enterToSend} onChange={(checked) => onChange({ ...settings, enterToSend: checked })} />
            <Toggle label={copy.timestamps} checked={settings.showTimestamps} onChange={(checked) => onChange({ ...settings, showTimestamps: checked })} />
          </SettingGroup>

          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{copy.privacy}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.privacyBody}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-5 dark:border-white/10">
            <div className="flex gap-3">
              <Database className="mt-0.5 size-5 shrink-0 text-violet-600 dark:text-violet-300" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">{copy.localHistory}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.localHistoryBody}</p>
                <button type="button" onClick={onClearHistory} className="mt-4 rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-500/30 dark:hover:bg-rose-500/10">
                  {copy.clearAll}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-violet-950 p-5 text-white">
            <div className="flex gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-violet-300" />
              <dl className="grid flex-1 gap-3 text-sm">
                <MetaRow label={copy.version} value={APP_VERSION} />
                <MetaRow label={copy.publicModel} value={PUBLIC_MODEL} />
                <MetaRow label={copy.infrastructure} value={INFRASTRUCTURE} />
              </dl>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-white/10">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={cn("relative h-6 w-11 rounded-full transition peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500 peer-focus-visible:ring-offset-2", checked ? "bg-violet-600" : "bg-slate-300 dark:bg-slate-700")}>
        <span className={cn("absolute left-1 top-1 size-4 rounded-full bg-white shadow transition", checked && "translate-x-5")} />
      </span>
    </label>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-semibold text-slate-100 sm:text-right">{value}</dd>
    </div>
  );
}
