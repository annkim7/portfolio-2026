import type { Slide } from "@/data/slides";

type SlideTitleProps = {
  slide: Slide;
  index: number;
};

export function SlideTitle({ slide, index }: SlideTitleProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <>
      <p className="absolute bottom-[var(--index-bottom)] left-[var(--pad-x)] m-0 text-[length:var(--fs-index)] font-semibold">
        {number}
      </p>
      <div className="absolute bottom-[var(--title-bottom)] left-[var(--pad-x)]">
        <p className="m-0 text-[length:var(--fs-title)] leading-none font-bold">
          {slide.title}
        </p>
        <p className="m-0 text-[length:var(--fs-sub)] leading-[1.1] font-bold">
          {slide.subtitle}
        </p>
      </div>
    </>
  );
}
