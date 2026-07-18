import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`glass flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ${
          scrolled ? "shadow-[0_10px_40px_-10px_oklch(0.55_0.24_275/40%)]" : ""
        }`}
      >
        <a href="#" className="flex items-center gap-2 pl-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-lg blur-md opacity-70 bg-[image:var(--gradient-primary)] -z-10" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Interview<span className="text-gradient">AI</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#"
            className="hidden rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Login
          </a>
          <a
            href="#cta"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.65_0.26_300/70%)] transition-transform hover:scale-[1.03]"
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
