"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HEADER_INTRO, REDUCED_DURATION } from "@/lib/motion";
import { motion } from "motion/react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

const navItems = ["LAYOUT", "DESIGN", "LUSON"] as const;

const controlClass =
  "pointer-events-auto cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-[length:var(--fs-nav)] font-semibold tracking-[0.04em] text-[var(--fg)] transition-opacity duration-200 hover:opacity-50";

export function Header() {
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
        DD
      </p>

      <button
        type="button"
        className={`${controlClass} absolute top-[var(--header-top)] left-[var(--product-left)] -translate-y-1/2`}
      >
        PRODUCT
      </button>

      <nav
        aria-label="주요 메뉴"
        className="nav-center absolute top-[var(--header-top)] left-1/2 flex -translate-x-1/2 -translate-y-1/2"
      >
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            className={`${controlClass} w-[var(--nav-gap)] text-center`}
          >
            {item}
          </button>
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
          <button
            key={item}
            type="button"
            className={controlClass}
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="검색"
        className={`${controlClass} absolute top-[var(--header-top)] right-[var(--icon-search-right)] -translate-y-1/2`}
      >
        <Search strokeWidth={1.75} size={14} />
      </button>
      <button
        type="button"
        aria-label="장바구니"
        className={`${controlClass} absolute top-[var(--header-top)] right-[var(--icon-cart-right)] -translate-y-1/2`}
      >
        <ShoppingCart strokeWidth={1.75} size={14} />
      </button>
    </motion.header>
  );
}
