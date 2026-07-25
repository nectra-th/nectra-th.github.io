import type { ReactNode } from "react";
import FigmaNode, { type FigNode } from "./FigmaNode";

export type FigSection = { name: string; top: number; bottom: number; height: number; nodes: FigNode[] };

/* Renders one Figma section as a relative box of the exact Figma height,
   with every child absolutely positioned. `islands` maps a node id OR node
   name to a React node that replaces the transpiled element (logo, links,
   interactive components). */
export default function FigmaSection({
  section,
  islands = {},
  hidden = new Set<string>(),
  zIndex,
  width = 1920,
}: {
  section: FigSection;
  islands?: Record<string, ReactNode>;
  hidden?: Set<string>;
  zIndex?: number;
  width?: number;
}) {
  return (
    <section
      id={section.name}
      data-fig-section={section.name}
      style={{ position: "relative", width, height: section.height, zIndex, scrollMarginTop: 100 }}
    >
      {section.nodes.map((n) => {
        if (hidden.has(n.id) || hidden.has(n.name)) return null;
        const island = islands[n.id] ?? islands[n.name];
        return <FigmaNode key={n.key} node={n} island={island} frameW={width} />;
      })}
    </section>
  );
}
