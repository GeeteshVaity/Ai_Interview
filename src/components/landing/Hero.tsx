import { motion } from "motion/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { AetherPortal } from "./AetherPortal";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center px-4 pt-28 pb-16">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground lg:mx-0"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon-cyan)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)]" />
            </span>
            Meet Aether — your AI interview mentor
          </motion.div>

          <h1 className="font-display text-5xl font-semibold leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">
            Master Every <br className="hidden sm:inline" />
            <span className="text-gradient">Interview</span> with AI
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            Upload your resume. Practice with a voice-driven AI interviewer.
            Receive personalized feedback — and land your dream job.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <MagneticButton primary>
              <span className="flex items-center gap-2">
                Start Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </MagneticButton>
            <MagneticButton>
              <span className="flex items-center gap-2">
                <Play className="h-3.5 w-3.5 fill-current" />
                Watch Demo
              </span>
            </MagneticButton>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground lg:justify-start">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
              GPT-class voice AI
            </div>
            <div className="h-3 w-px bg-white/10" />
            <div>Loved by 12,000+ candidates</div>
            <div className="h-3 w-px bg-white/10" />
            <div>SOC 2 in progress</div>
          </div>
        </motion.div>

        {/* Portal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <AetherPortal />
        </motion.div>
      </div>
    </section>
  );
}

function MagneticButton({
  children,
  primary,
}: {
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={
        primary
          ? "group relative overflow-hidden rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.65_0.26_300/70%)]"
          : "glass group relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
      }
    >
      {children}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </motion.button>
  );
}
