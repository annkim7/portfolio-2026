import { Stage } from "@/components/Stage";
import { getSiteLinks } from "@/lib/links";

export default function Home() {
  return (
    <main>
      <Stage links={getSiteLinks()} />
    </main>
  );
}
