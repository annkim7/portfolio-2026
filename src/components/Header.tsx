"use client";

import type { SiteLinks } from "@/lib/links";
import { useEffect, useId, useRef, useState } from "react";

const projects = [
  { label: "ANDROID", key: "android" },
  { label: "IOS", key: "ios" },
  { label: "WEB", key: "web" },
] as const satisfies ReadonlyArray<{ label: string; key: keyof SiteLinks }>;

function ExternalLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: string;
  onClick?: () => void;
}) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      {children}
    </a>
  );
}

export function Header({ links }: { links: SiteLinks }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <>
      <div className="top-bar">
        <div className="top-links">
          <span className="brand">NK PORTFOLIO</span>
          <span className="nav-desktop" aria-hidden="true">
            /
          </span>
          <ExternalLink href={links.linkedin} className="nav-desktop">
            LINKEDIN
          </ExternalLink>
          <span className="nav-desktop" aria-hidden="true">
            /
          </span>
          <ExternalLink href={links.github} className="nav-desktop">
            GITHUB
          </ExternalLink>
        </div>
        <button
          ref={buttonRef}
          type="button"
          className="menu-btn"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <span className="burger-x" aria-hidden="true">
              <i />
              <i />
            </span>
          ) : (
            <span className="burger" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
        </button>
      </div>
      {open ? (
        <div ref={panelRef} id={panelId} className="menu-panel">
          <ExternalLink href={links.linkedin} className="menu-link-compact" onClick={() => setOpen(false)}>
            LINKEDIN
          </ExternalLink>
          <ExternalLink href={links.github} className="menu-link-compact" onClick={() => setOpen(false)}>
            GITHUB
          </ExternalLink>
          {projects.map((item) => (
            <ExternalLink key={item.key} href={links[item.key]} onClick={() => setOpen(false)}>
              {item.label}
            </ExternalLink>
          ))}
        </div>
      ) : null}
    </>
  );
}
