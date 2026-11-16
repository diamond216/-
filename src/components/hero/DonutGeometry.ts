import type { MomentumKey, MomentumSlice } from "@/services/shelf";

export interface DonutPiece {
  key: MomentumKey;
  count: number;
  /** An arc for slices wide enough to have rounded ends; otherwise a dot sitting where the slice would be. */
  shape: { kind: "arc"; d: string } | { kind: "dot"; cx: number; cy: number; r: number };
}

/** Rounded so the server-rendered markup and the browser's agree to the last digit. */
const round = (value: number) => Math.round(value * 100) / 100;

/** The drawing maths for the hero donut. Knows nothing about React or where the numbers come from. */
export class DonutGeometry {
  readonly size = 236;
  readonly center = 118;
  readonly radius = 100;
  readonly thickness = 34;
  readonly holeRadius = 64;
  /** Degrees of clear paper between neighbouring slices. */
  private readonly gap = 4;

  /** Half a stroke's width, in degrees, so rounded ends don't run into the gap. */
  private get capDegrees(): number {
    return ((this.thickness / 2 / this.radius) * 180) / Math.PI;
  }

  point(degrees: number): [number, number] {
    const angle = ((degrees - 90) * Math.PI) / 180;
    return [round(this.center + this.radius * Math.cos(angle)), round(this.center + this.radius * Math.sin(angle))];
  }

  arc(from: number, to: number): string {
    const [ax, ay] = this.point(from);
    const [bx, by] = this.point(to);
    return `M${ax} ${ay} A${this.radius} ${this.radius} 0 ${to - from > 180 ? 1 : 0} 1 ${bx} ${by}`;
  }

  /** Lays the slices clockwise from twelve o'clock. Empty slices are left out. */
  pieces(slices: readonly MomentumSlice[]): DonutPiece[] {
    const total = slices.reduce((sum, slice) => sum + slice.count, 0);
    if (total === 0) return [];
    const shown = slices.filter((slice) => slice.count > 0);
    // A single slice is a full ring: no gaps, no ends.
    if (shown.length === 1) {
      const { key, count } = shown[0];
      return [{ key, count, shape: { kind: "arc", d: `${this.arc(0, 180)} ${this.arc(180, 359.99).replace(/^M[^A]+/, "")}` } }];
    }
    let start = 0;
    return shown.map(({ key, count }) => {
      const sweep = (count / total) * 360;
      const from = start + this.gap / 2 + this.capDegrees;
      const to = start + sweep - this.gap / 2 - this.capDegrees;
      const middle = start + sweep / 2;
      start += sweep;
      if (to > from) return { key, count, shape: { kind: "arc", d: this.arc(from, to) } };
      const [cx, cy] = this.point(middle);
      return { key, count, shape: { kind: "dot", cx, cy, r: this.thickness / 2 } };
    });
  }
}
