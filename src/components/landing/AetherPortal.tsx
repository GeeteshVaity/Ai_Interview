import { motion } from "motion/react";
import aether from "@/assets/aether.png";
import {
  FileText,
  MessageSquare,
  Mic,
  Brain,
  BarChart3,
  Sparkles,
} from "lucide-react";

const cards = [
  { icon: FileText, label: "Resume Analysis", pos: "top-[6%] left-0 sm:-left-6 md:-left-12" },
  { icon: MessageSquare, label: "AI Interview", pos: "top-[4%] right-0 sm:-right-4 md:-right-10" },
  { icon: Mic, label: "Voice AI", pos: "top-1/2 -left-2 sm:-left-8 md:-left-16 -translate-y-1/2", hideOnMobile: false },
  { icon: Brain, label: "LLM Intelligence", pos: "top-1/2 -right-2 sm:-right-8 md:-right-14 -translate-y-1/2" },
  { icon: BarChart3, label: "Analytics", pos: "bottom-[8%] left-2 sm:-left-4 md:-left-8", hideOnMobile: true },
  { icon: Sparkles, label: "Personalized Feedback", pos: "bottom-[6%] right-2 sm:-right-4 md:-right-8", hideOnMobile: true },
];


export function AetherPortal() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Portal glow layers */}
      <div
        aria-hidden
        className="absolute inset-6 rounded-full opacity-70 blur-3xl"
        style={{ background: "var(--gradient-portal)" }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: "var(--gradient-portal)", filter: "blur(2px)", mask: "radial-gradient(circle, transparent 58%, black 60%, transparent 68%)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-6 rounded-full border border-white/10"
        style={{ mask: "radial-gradient(circle, transparent 62%, black 63%, transparent 71%)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner disc */}
      <div className="absolute inset-10 rounded-full bg-gradient-to-br from-[oklch(0.2_0.05_275)] via-[oklch(0.16_0.05_290)] to-[oklch(0.14_0.03_260)] shadow-[inset_0_0_80px_oklch(0.55_0.24_275/40%)]" />

      {/* Aether portrait — head anchored near portal center, body fades into portal */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {/* Halo behind head */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[26%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.22 260 / 55%), transparent 70%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 62% 70% at 50% 45%, black 55%, transparent 88%)",
            maskImage:
              "radial-gradient(ellipse 62% 70% at 50% 45%, black 55%, transparent 88%)",
          }}
        >
          <motion.img
            src={aether}
            alt="Aether — your AI interview mentor"
            width={1024}
            height={1536}
            className="absolute left-1/2 top-[4%] w-[74%] -translate-x-1/2 mix-blend-screen"
            style={{
              filter:
                "drop-shadow(0 8px 30px oklch(0.65 0.24 260 / 70%)) contrast(1.08) saturate(1.12) brightness(1.05)",
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>


      {/* Ground reflection */}
      <div className="pointer-events-none absolute inset-x-10 bottom-8 h-6 rounded-[50%] bg-[radial-gradient(ellipse,oklch(0.7_0.22_270/50%),transparent_70%)] blur-md" />

      {/* Floating cards */}
      {cards.map((c, i) => (
        <FloatingCard key={c.label} {...c} delay={i * 0.15} />
      ))}
    </div>
  );
}

function FloatingCard({
  icon: Icon,
  label,
  pos,
  delay,
  hideOnMobile,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  pos: string;
  delay: number;
  hideOnMobile?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + delay, duration: 0.7, ease: "easeOut" }}
      className={`absolute ${pos} z-10 ${hideOnMobile ? "hidden sm:block" : ""}`}
    >

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4 + delay * 2, repeat: Infinity, ease: "easeInOut", delay }}
        className="glass-strong flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-medium tracking-tight text-foreground/90 shadow-[0_8px_30px_-10px_oklch(0.55_0.24_275/60%)]"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[image:var(--gradient-primary)] text-primary-foreground">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </motion.div>
    </motion.div>
  );
}
