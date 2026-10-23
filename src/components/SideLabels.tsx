import type { Slide } from "@/data/slides";

type SideLabelsProps = {
  slide: Slide;
};

export function SideLabels({ slide }: SideLabelsProps) {
  return (
    <>
      <div className="absolute right-[var(--pad-x-right)] bottom-[var(--label-top-bottom)] flex flex-col items-end gap-px text-right">
        {slide.labelInverse.map((line) => (
          <span
            key={line}
            className="inline-block bg-[var(--fg)] px-[3px] text-[length:var(--fs-label)] leading-[1.15] font-bold text-[var(--fg-inverse)]"
          >
            {line}
          </span>
        ))}
      </div>
      <div className="label-plain absolute right-[var(--pad-x-right)] bottom-[var(--label-bottom)] flex flex-col items-end text-right">
        {slide.label.map((line) => (
          <span
            key={line}
            className="text-[length:var(--fs-label)] leading-[1.15] font-bold"
          >
            {line}
          </span>
        ))}
      </div>
    </>
  );
}
