import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BrainCircuit, Database, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { QivrenLogo } from "@/components/logo";
import { APP_VERSION, INFRASTRUCTURE, PUBLIC_MODEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-[#f7f7fb] px-4 py-6 text-slate-950 dark:bg-[#080a12] dark:text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <QivrenLogo />
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <ArrowLeft className="size-4" /> Back to chat
          </Link>
        </div>

        <section className="relative mt-10 overflow-hidden rounded-[36px] border border-slate-200 bg-white p-7 shadow-glow dark:border-white/10 dark:bg-slate-950 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200">
              <Sparkles className="size-3.5" /> {APP_VERSION}
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">Meet QIVREN.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              QIVREN is a multilingual intelligent assistant designed for clear answers, useful reasoning, writing, coding help, and everyday problem solving.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoCard icon={BrainCircuit} title="Public model" body={PUBLIC_MODEL} />
          <InfoCard icon={Sparkles} title="Infrastructure" body={INFRASTRUCTURE} />
          <InfoCard icon={Database} title="Local history" body="Chat history is stored in your browser on this device until you clear it." />
          <InfoCard icon={LockKeyhole} title="Server-side credentials" body="API credentials stay on the server and are never shipped to the browser." />
        </section>

        <section className="mt-6 rounded-[30px] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.035] sm:p-8">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">Privacy and infrastructure disclosure</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                QIVREN sends messages through its own secure server route. Third-party AI infrastructure can process requests to generate responses. QIVREN does not claim that its underlying model was trained from scratch. Avoid entering passwords, payment data, government identifiers, or other highly sensitive information.
              </p>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-xs font-medium text-slate-400">Powered by Vireqon Intelligence</footer>
      </div>
    </main>
  );
}

function InfoCard({ icon: Icon, title, body }: { icon: typeof Sparkles; title: string; body: string }) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
      <div className="grid size-10 place-items-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
        <Icon className="size-5" />
      </div>
      <h2 className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-slate-400">{title}</h2>
      <p className="mt-2 text-base font-semibold leading-7 text-slate-800 dark:text-slate-100">{body}</p>
    </article>
  );
}
