import { sideCopy } from "@/data/slides";

export function SideLabels() {
  return (
    <>
      <p className="side-label left" aria-hidden="true">
        {sideCopy.left}
      </p>
      <p className="side-label right" aria-hidden="true">
        {sideCopy.right}
      </p>
    </>
  );
}
