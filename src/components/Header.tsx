"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { SiteLinks } from "@/lib/links";
import { HEADER_INTRO, REDUCED_DURATION } from "@/lib/motion";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const navItems = [
  { label: "ANDROID", key: "android" },
  { label: "IOS", key: "ios" },
  { label: "WEB", key: "web" },
] as const satisfies ReadonlyArray<{ label: string; key: keyof SiteLinks }>;

const controlClass =
  "pointer-events-auto inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 font-[inherit] text-[length:var(--fs-nav)] font-semibold tracking-[0.04em] text-[var(--fg)] no-underline transition-opacity duration-200 hover:opacity-50";

function ExternalLink({
  href,
  className,
  label,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  label?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      className={className ? `${controlClass} ${className}` : controlClass}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
    </a>
  );
}

function HeaderIcon({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
      {children}
    </svg>
  );
}

export function Header({ links }: { links: SiteLinks }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <motion.header
      className="pointer-events-none absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: reduced ? REDUCED_DURATION : HEADER_INTRO.duration,
        delay: reduced ? 0 : HEADER_INTRO.delay,
      }}
    >
      <p className="absolute top-[var(--header-top)] left-[var(--pad-x)] m-0 -translate-y-1/2 text-[length:var(--fs-logo)] font-bold tracking-[0.02em]">
        NK
      </p>

      <button
        type="button"
        className={`${controlClass} absolute top-[var(--header-top)] left-[var(--product-left)] -translate-y-1/2`}
      >
        PORTFOLIO
      </button>

      <nav
        aria-label="주요 메뉴"
        className="nav-center absolute top-[var(--header-top)] left-1/2 flex -translate-x-1/2 -translate-y-1/2"
      >
        {navItems.map((item) => (
          <ExternalLink
            key={item.key}
            href={links[item.key]}
            className="w-[var(--nav-gap)] text-center"
          >
            {item.label}
          </ExternalLink>
        ))}
      </nav>

      <button
        type="button"
        className={`${controlClass} nav-menu-button absolute top-[var(--header-top)] right-[var(--icon-menu-right)] -translate-y-1/2 place-items-center`}
        aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X strokeWidth={1.75} size={14} /> : <Menu strokeWidth={1.75} size={14} />}
      </button>
      <div
        className={`nav-menu-panel pointer-events-auto absolute top-[calc(var(--header-top)+28px)] right-[var(--icon-menu-right)] flex-col items-end gap-4 ${menuOpen ? "is-open" : ""}`}
      >
        {navItems.map((item) => (
          <ExternalLink
            key={item.key}
            href={links[item.key]}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </ExternalLink>
        ))}
      </div>

      <ExternalLink
        href={links.linkedin}
        label="링크드인"
        className="absolute top-[var(--header-top)] right-[var(--icon-search-right)] -translate-y-1/2"
      >
        <HeaderIcon>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </HeaderIcon>
      </ExternalLink>
      <ExternalLink
        href={links.github}
        label="깃허브"
        className="absolute top-[var(--header-top)] right-[var(--icon-cart-right)] -translate-y-1/2"
      >
        <HeaderIcon>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </HeaderIcon>
      </ExternalLink>
    </motion.header>
  );
}
