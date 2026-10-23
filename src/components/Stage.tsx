"use client";

import { slides } from "@/data/slides";
import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { SideLabels } from "@/components/SideLabels";
import { SlideObject } from "@/components/SlideObject";
import { SlideTitle } from "@/components/SlideTitle";

export function Stage() {
  const index = 1;
  const slide = slides[index];

  return (
    <div className="stage fixed inset-0">
      <Header />
      <SlideObject slide={slide} priority />
      <SlideTitle slide={slide} index={index} />
      <SideLabels slide={slide} />
      <Pagination count={slides.length} active={index} />
    </div>
  );
}
