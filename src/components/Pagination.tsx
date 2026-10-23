type PaginationProps = {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
};

export function Pagination({ count, active, onSelect }: PaginationProps) {
  return (
    <div
      className="absolute bottom-[calc(var(--dots-bottom)-(24px-7px)/2)] left-1/2 flex -translate-x-1/2 items-center"
      style={{ gap: 10 }}
    >
      {Array.from({ length: count }, (_, index) => {
        const selected = index === active;

        return (
          <button
            key={index}
            type="button"
            aria-label={`슬라이드 ${index + 1}로 이동`}
            aria-current={selected ? "true" : undefined}
            onClick={() => onSelect?.(index)}
            className="relative cursor-pointer border-0 bg-transparent p-0"
            style={{ width: 24, height: 24, marginInline: -8.5 }}
          >
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 box-border -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.25px] border-[var(--fg)]"
              style={{
                width: 7,
                height: 7,
                background: selected ? "var(--fg)" : "transparent",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
