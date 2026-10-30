import { slides } from "@/data/slides";

type PaginationProps = {
  active: number;
  onSelect: (index: number) => void;
};

export function Pagination({ active, onSelect }: PaginationProps) {
  return (
    <nav className="slide-tabs" aria-label="슬라이드">
      {slides.map((slide, index) => {
        const [number, ...rest] = slide.tab.split(" ");
        return (
          <button
            key={slide.id}
            type="button"
            aria-label={slide.tab}
            aria-current={index === active ? "page" : undefined}
            onClick={() => onSelect(index)}
          >
            {number}
            <span className="tab-rest"> {rest.join(" ")}</span>
          </button>
        );
      })}
    </nav>
  );
}
