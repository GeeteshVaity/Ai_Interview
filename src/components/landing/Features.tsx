import { motion } from "motion/react";
import {
  FileText,
  Mic,
  Brain,
  BarChart3,
  Sparkles,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    desc: "Aether parses your resume, extracts skills and projects, and maps them into a tailored interview plan.",
  },
  {
    icon: MessageSquare,
    title: "Adaptive AI Interviewer",
    desc: "Realistic interviews that adapt in real time — from behavioural to system design and role-specific deep dives.",
  },
  {
    icon: Mic,
    title: "Voice-First Practice",
    desc: "Natural voice conversation with live transcription. Sounds human. Feels like the real thing.",
  },
  {
    icon: Brain,
    title: "LLM Intelligence",
    desc: "Powered by frontier models fine-tuned for interview reasoning, structured evaluation and follow-ups.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Track technical accuracy, communication, confidence and completeness across every session.",
  },
  {
    icon: Sparkles,
    title: "Personalized Feedback",
    desc: "Actionable, per-answer feedback and a personal roadmap Aether builds just for you.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to interview like a pro"
          sub="A complete practice studio built around your resume, your role, and your voice."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Animated border */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.7 0.22 270 / 60%) 90deg, transparent 180deg, oklch(0.65 0.26 305 / 60%) 270deg, transparent 360deg)",
        }}
      />
      <div className="glass-strong relative m-px rounded-[calc(1rem-1px)] p-6 h-full">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.65_0.26_300/60%)]">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>

        {/* Hover glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(400px circle at var(--x,50%) var(--y,0%), oklch(0.7 0.22 275 / 15%), transparent 60%)",
          }}
        />
      </div>
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass mx-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
      >
        <span className="h-1 w-1 rounded-full bg-[var(--neon-cyan)]" />
        {eyebrow}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-base text-muted-foreground sm:text-lg"
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
