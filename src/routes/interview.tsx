import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  Send,
  Volume2,
  ChevronRight,
  Circle,
  Clock,
} from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { RobotMascot } from "@/components/robot/RobotMascot";

export const Route = createFileRoute("/interview")({
  component: InterviewPage,
  head: () => ({
    meta: [
      { title: "Live interview — InterviewAI" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const questions = [
  "Walk me through a project you led end-to-end and the impact it had.",
  "Tell me about a time you disagreed with a teammate. How did you resolve it?",
  "How do you decide what to prioritize when everything feels urgent?",
  "Describe a technical challenge you overcame in the last six months.",
  "Where do you see the biggest opportunity to improve our product?",
];

const seedTranscript: { who: "AI" | "You"; text: string }[] = [
  { who: "AI", text: "Great — let's begin. Take your time." },
  { who: "You", text: "Sure, I'd love to start with a recent project…" },
];

function InterviewPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState(0);
  const [recording, setRecording] = useState(false);
  const [answer, setAnswer] = useState("");
  const [transcript, setTranscript] = useState(seedTranscript);
  const [elapsed, setElapsed] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const submitAnswer = () => {
    if (!answer.trim()) return;
    setTranscript((t) => [...t, { who: "You", text: answer }]);
    setAnswer("");
    setTimeout(() => {
      if (q + 1 < questions.length) {
        setQ((n) => n + 1);
        setTranscript((t) => [...t, { who: "AI", text: questions[q + 1] }]);
      } else {
        navigate({ to: "/results" });
      }
    }, 500);
  };

  const progress = ((q + 1) / questions.length) * 100;

  return (
    <PageShell>
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
        {/* LEFT — Robot + status */}
        <aside className="order-2 lg:order-1">
          <div className="glass-strong sticky top-28 rounded-3xl p-5">
            <div className="flex justify-center">
              <RobotMascot size={240} speaking={!recording} showParticles={false} />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-xs">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-muted-foreground">
                {recording ? "Listening…" : "Nova is speaking"}
              </span>
              <Volume2 className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Voice mode active · Powered by GPT-class voice AI
            </p>
          </div>
        </aside>

        {/* CENTER — Question + input */}
        <div className="order-1 lg:order-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Question <span className="text-foreground">{q + 1}</span> of {questions.length}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> {mm}:{ss}
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[image:var(--gradient-primary)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-strong relative mt-6 overflow-hidden rounded-3xl p-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-30"
                style={{ background: "var(--gradient-aurora)" }}
              />
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                <Circle className="h-2 w-2 fill-[var(--neon-cyan)] text-[var(--neon-cyan)]" />
                Nova asks
              </div>
              <h2 className="mt-3 font-display text-2xl font-medium leading-snug sm:text-3xl">
                {questions[q]}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Bottom composer */}
          <div className="glass-strong mt-6 rounded-3xl p-4">
            <div className="flex items-end gap-3">
              <motion.button
                onClick={() => setRecording((r) => !r)}
                whileTap={{ scale: 0.94 }}
                className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors ${
                  recording
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-[image:var(--gradient-primary)] text-primary-foreground"
                }`}
                aria-label={recording ? "Stop recording" : "Start recording"}
              >
                <Mic className="h-6 w-6" />
                {recording && (
                  <>
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-destructive"
                      animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full border-2 border-destructive"
                      animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                    />
                  </>
                )}
              </motion.button>
              <div className="min-w-0 flex-1">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitAnswer();
                    }
                  }}
                  placeholder="Type your answer or hold the mic to speak…"
                  rows={2}
                  className="w-full resize-none rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-[var(--neon-cyan)]/60"
                />
              </div>
              <button
                onClick={submitAnswer}
                disabled={!answer.trim()}
                className="group flex h-14 items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-5 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.65_0.26_300/70%)] transition-opacity disabled:opacity-40"
              >
                Submit
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Transcript */}
        <aside className="order-3">
          <div className="glass-strong sticky top-28 flex h-[calc(100vh-9rem)] max-h-[720px] flex-col rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">Live Transcript</h3>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-muted-foreground">
                Behavioral · Round 1
              </span>
            </div>
            <div
              ref={listRef}
              className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1"
            >
              {transcript.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    t.who === "AI"
                      ? "bg-white/[0.04] text-foreground/90"
                      : "ml-6 bg-[image:var(--gradient-primary)] text-primary-foreground"
                  }`}
                >
                  <div className="mb-0.5 text-[10px] uppercase tracking-wider opacity-70">
                    {t.who === "AI" ? "Nova" : "You"}
                  </div>
                  {t.text}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-[image:var(--gradient-primary)]"
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <button
                onClick={() => navigate({ to: "/results" })}
                className="mt-3 w-full rounded-full border border-white/10 py-2 text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                End interview
              </button>
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
