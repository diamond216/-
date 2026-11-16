import type { Project } from "@/domain";
import type { ReactNode } from "react";

/** The patterned cover. Pattern comes from the category, colour from the project. Purely decorative. */
export function Cover({ project, children }: { project: Project; children?: ReactNode }) {
  return (
    <div
      className={`cover cover--${project.category.id}`}
      style={{ "--c": project.coverColor } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
