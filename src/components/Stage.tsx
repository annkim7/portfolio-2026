"use client";

import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { SideLabels } from "@/components/SideLabels";
import { SlideObject } from "@/components/SlideObject";
import { SlideTitle } from "@/components/SlideTitle";
import { slides } from "@/data/slides";
import { useSlideNavigation } from "@/hooks/useSlideNavigation";

const TRANSITION_LOCK_MS = 1100;

export function Stage() {
  const { index, goTo } = useSlideNavigation({
    count: slides.length,
    duration: TRANSITION_LOCK_MS,
    ids: slides.map((slide) => slide.id),
  });
  const slide = slides[index];

  return (
    <div className="stage fixed inset-0">
      <Header />
      <SlideObject slide={slide} priority={index === 0} />
      <SlideTitle slide={slide} index={index} />
      <SideLabels slide={slide} />
      <Pagination count={slides.length} active={index} onSelect={goTo} />
    </div>
  );
}
