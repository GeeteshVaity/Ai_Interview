import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Award,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Lightbulb,
  RotateCw,
  Home,
  CheckCircle2,
} from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: "Your interview results — InterviewAI" },
      { name: "description", content: "Personalized AI feedback on your interview performance." },
    ],
  }),
});

const strengths = [
  "Clear STAR-style structure with concrete outcomes",
  "Strong ownership language and quantified impact",
  "Confident, well-paced delivery",
];

const weaknesses = [
  "Answers occasionally drift into technical detail before framing the goal",
  "Limited reflection on trade-offs and alternative approaches",
  "Could tie stories back to the target role more explicitly",
];

const improvements = [
  "Open every answer with a one-sentence headline before the story",
  "Practice trimming answers to 90–120 seconds for behavioral prompts",
  "Prepare two crisp examples of cross-functional collaboration",
];

function ResultsPage() {
  const score = 82;

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-5xl px-4">
        {/* Completion badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative">
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: "var(--gradient-portal)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div className="glass-strong relative flex h-24 w-24 items-center justify-center rounded-full">
              <CheckCircle2 className="h-10 w-10 text-[var(--neon-cyan)]" />
            </div>
          </div>
          <div className="glass mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)]" />
            Session complete
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Interview <span className="text-gradient">Complete</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Nova reviewed every answer. Here's your personalized breakdown.
          </p>
        </motion.div>

        {/* Score + summary */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <ScoreCard score={score} />
          <StatCard icon={TrendingUp} label="Clarity" value="88" tone="cyan" />
          <StatCard icon={MessageSquare} label="Structure" value="79" tone="purple" />
        </div>

        {/* Feedback grid */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <ListCard
            icon={Award}
            title="Strengths"
            items={strengths}
            accent="oklch(0.85 0.16 210)"
          />
          <ListCard
            icon={AlertCircle}
            title="Areas to improve"
            items={weaknesses}
            accent="oklch(0.72 0.24 30)"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong mt-6 rounded-3xl p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[var(--neon-cyan)]" />
            <h3 className="font-display text-lg font-semibold">AI Feedback</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You demonstrated strong ownership and quantified impact throughout the session.
            Your best moment was the project story about scaling reliability — the outcome
            was concrete and the metric memorable. Watch for meandering openings on
            behavioral prompts; anchor each answer with a one-line headline before diving
            into detail. Overall a poised, senior-level performance.
          </p>
        </motion.div>

        <ListCard
          icon={Lightbulb}
          title="Suggested Improvements"
          items={improvements}
          accent="oklch(0.75 0.2 90)"
          className="mt-6"
        />

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/interview"
            className="group inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.65_0.26_300/70%)] transition-transform hover:scale-[1.03]"
          >
            <RotateCw className="h-4 w-4" />
            Retry Interview
          </Link>
          <Link
            to="/"
            className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium hover:bg-white/[0.06]"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function ScoreCard({ score }: { score: number }) {
  const R = 46;
  const C = 2 * Math.PI * R;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-strong relative flex items-center gap-5 overflow-hidden rounded-3xl p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{ background: "var(--gradient-aurora)" }}
      />
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 110 110" className="h-full w-full">
          <defs>
            <linearGradient id="sG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.72 0.19 250)" />
              <stop offset="100%" stopColor="oklch(0.65 0.26 305)" />
            </linearGradient>
          </defs>
          <circle cx={55} cy={55} r={R} fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth={6} />
          <motion.circle
            cx={55}
            cy={55}
            r={R}
            fill="none"
            stroke="url(#sG)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C - (C * score) / 100 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            transform="rotate(-90 55 55)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-3xl font-semibold">{score}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            / 100
          </div>
        </div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
          Overall Score
        </div>
        <div className="mt-1 font-display text-xl font-semibold">Strong</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Above the 78th percentile of candidates.
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "cyan" | "purple";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-strong flex items-center gap-4 rounded-3xl p-6"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{
          background:
            tone === "cyan"
              ? "oklch(0.85 0.16 210 / 18%)"
              : "oklch(0.65 0.26 305 / 22%)",
          color:
            tone === "cyan" ? "oklch(0.85 0.16 210)" : "oklch(0.8 0.2 305)",
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 font-display text-2xl font-semibold">{value}</div>
      </div>
    </motion.div>
  );
}

function ListCard({
  icon: Icon,
  title,
  items,
  accent,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  accent: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-strong rounded-3xl p-6 ${className}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" style={{ color: accent }} />
        <h3 className="font-display text-lg font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
