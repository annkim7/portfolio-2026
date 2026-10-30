import type { Slide } from "@/data/slides";

function VDots() {
  return (
    <span className="vdots" aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

export function DotRow({ slide }: { slide: Slide }) {
  return (
    <div className="dot-row">
      <VDots />
      <span key={slide.stack} className="dot-label">
        {slide.stack}
      </span>
      <VDots />
      <span key={slide.category} className="dot-label">
        {slide.category}
      </span>
      <VDots />
    </div>
  );
}
