"use client";

import { CreatureLayer } from "@/components/CreatureLayer";
import { DotRow } from "@/components/DotRow";
import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { SideLabels } from "@/components/SideLabels";
import { SlideObject } from "@/components/SlideObject";
import { SlideTitle } from "@/components/SlideTitle";
import { slides } from "@/data/slides";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";
import type { SiteLinks } from "@/lib/links";
import { SLIDE_LOCK_MS } from "@/lib/motion";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

function AdjacentSlides({ index }: { index: number }) {
  const neighbors = [index - 1, index + 1].filter(
    (item) => item >= 0 && item < slides.length,
  );

  return (
    <div aria-hidden className="preload-slot">
      {neighbors.map((item) => {
        const neighbor = slides[item];
        if (!neighbor.image) return null;
        return (
          <Image
            key={neighbor.id}
            src={neighbor.image.src}
            alt=""
            width={neighbor.image.width}
            height={neighbor.image.height}
            sizes="100vw"
          />
        );
      })}
    </div>
  );
}

export function Stage({ links }: { links: SiteLinks }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const onMenuOpenChange = useCallback((open: boolean) => setMenuOpen(open), []);
  const { index, goTo } = useSlideNavigation({
    count: slides.length,
    duration: SLIDE_LOCK_MS,
    ids: slides.map((slide) => slide.id),
    rootRef,
    blocked: menuOpen,
  });
  const slide = slides[index];
  const reduced = useReducedMotion();
  const announcement = `${index + 1} / ${slides.length}: ${slide.title.replace(/\.$/, "")} ${slide.subtitle}`;

  return (
    <div
      ref={rootRef}
      className="stage fixed inset-0"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="기술 스택 슬라이드"
    >
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <div className="hero">
        <AdjacentSlides index={index} />
        <SlideObject slide={slide} reduced={reduced} priority={index === 0} />
        <SlideTitle slide={slide} reduced={reduced} />
        <CreatureLayer
          active={slide.visual === "ocean"}
          preload={slides.some(
            (item, itemIndex) => item.visual === "ocean" && Math.abs(itemIndex - index) === 1,
          )}
        />
        <div className="hero-frame">
          <span className="bracket tl" aria-hidden="true" />
          <span className="bracket tr" aria-hidden="true" />
          <span className="bracket bl" aria-hidden="true" />
          <span className="bracket br" aria-hidden="true" />
          <Header links={links} onOpenChange={onMenuOpenChange} />
          <DotRow slide={slide} />
          <SideLabels />
          <Pagination active={index} onSelect={goTo} />
        </div>
      </div>
    </div>
  );
}
