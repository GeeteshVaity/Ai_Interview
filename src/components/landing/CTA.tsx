import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="cta" className="relative px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-strong relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-8 py-20 text-center"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-70"
          style={{ background: "var(--gradient-aurora)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 grid-overlay opacity-40"
        />
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Your next interview <span className="text-gradient">starts now.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Join thousands of candidates practicing with Aether every day.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="#"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.65_0.26_300/70%)]"
          >
            Start Free Journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </motion.a>
          <a
            href="#features"
            className="glass rounded-full px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06]"
          >
            Explore Features
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
        <div>© {new Date().getFullYear()} InterviewAI. Guided by Aether.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
