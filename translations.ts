"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { MAX_MESSAGE_LENGTH, PUBLIC_MODEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ComposerProps {
  placeholder: string;
  sendLabel: string;
  stopLabel: string;
  enterToSend: boolean;
  streaming: boolean;
  initialValue?: string;
  onSend: (content: string) => void;
  onStop: () => void;
}

export function Composer({ placeholder, sendLabel, stopLabel, enterToSend, streaming, initialValue = "", onSend, onStop }: ComposerProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  }, [value]);

  function submit() {
    const content = value.trim();
    if (!content || streaming || content.length > MAX_MESSAGE_LENGTH) return;
    onSend(content);
    setValue("");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-5">
      <div className="rounded-[26px] border border-slate-200/90 bg-white/95 p-2 shadow-glow backdrop-blur-xl transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-white/10 dark:bg-slate-900/95">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && enterToSend) {
              event.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={placeholder}
          className="max-h-[220px] min-h-12 w-full resize-none bg-transparent px-3 py-3 text-[15px] leading-6 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
          aria-label={placeholder}
        />
        <div className="flex items-center justify-between gap-3 px-2 pb-1">
          <div className="min-w-0 truncate text-[11px] font-medium text-slate-400">{PUBLIC_MODEL}</div>
          <div className="flex items-center gap-2">
            {value.length > MAX_MESSAGE_LENGTH * 0.85 && (
              <span className={cn("text-[11px]", value.length >= MAX_MESSAGE_LENGTH ? "text-rose-500" : "text-slate-400")}>
                {value.length}/{MAX_MESSAGE_LENGTH}
              </span>
            )}
            {streaming ? (
              <button
                type="button"
                onClick={onStop}
                className="grid size-9 place-items-center rounded-full bg-slate-950 text-white transition hover:scale-105 dark:bg-white dark:text-slate-950"
                aria-label={stopLabel}
                title={stopLabel}
              >
                <Square className="size-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!value.trim() || value.length > MAX_MESSAGE_LENGTH}
                className="grid size-9 place-items-center rounded-full bg-violet-600 text-white transition hover:scale-105 hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:scale-100 dark:disabled:bg-white/10"
                aria-label={sendLabel}
                title={sendLabel}
              >
                <ArrowUp className="size-4" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-400">Powered by Vireqon Intelligence · QIVREN may make mistakes. Verify important information.</p>
    </div>
  );
}
