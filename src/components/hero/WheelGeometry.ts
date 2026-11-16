import type { WheelTick } from "@/services/shelf";

export interface TickLine {
  id: string;
  today: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Rounded so the server-rendered markup and the browser's agree to the last digit. */
const round = (value: number) => Math.round(value * 100) / 100;

/** The drawing maths for the update wheel. Knows nothing about React or where numbers come from. */
export class WheelGeometry {
  readonly width = 480;
  readonly height = 420;
  readonly cx = 260;
  readonly cy = 210;
  readonly ringRadius = 158;
  readonly innerRadius = 112;
  readonly hubRadius = 56;
  private readonly tickStart = 168;
  private readonly calloutRadius = 196;

  point(radius: number, degrees: number): [number, number] {
    const angle = (degrees * Math.PI) / 180;
    return [round(this.cx + radius * Math.cos(angle)), round(this.cy + radius * Math.sin(angle))];
  }

  /** One short line per update, evenly spaced round the ring. Today's are longer. */
  tickLines(ticks: readonly WheelTick[]): TickLine[] {
    const arranged = WheelGeometry.spreadToday(ticks);
    return arranged.map((tick, index) => {
      const degrees = (index / arranged.length) * 360;
      // Heavier updates reach further out; a little wobble keeps the ring from looking machined.
      const wobble = ((index * 7919) % 97) / 97;
      const length = tick.today ? 24 : 5 + 13 * (0.55 * tick.strength + 0.45 * wobble);
      const [x1, y1] = this.point(this.tickStart, degrees);
      const [x2, y2] = this.point(this.tickStart + length, degrees);
      return { id: tick.id, today: tick.today, x1, y1, x2, y2 };
    });
  }

  spokes(): Array<{ x1: number; y1: number; x2: number; y2: number }> {
    return Array.from({ length: 8 }, (_, index) => {
      const [x1, y1] = this.point(this.hubRadius, index * 45);
      const [x2, y2] = this.point(this.ringRadius, index * 45);
      return { x1, y1, x2, y2 };
    });
  }

  /** An arc on the ring, starting near the top and sweeping clockwise for a share of the full turn. */
  arcPath(share: number, startDegrees = -100): string {
    const sweep = Math.min(Math.max(share, 0), 0.999) * 360;
    const [ax, ay] = this.point(this.ringRadius, startDegrees);
    const [bx, by] = this.point(this.ringRadius, startDegrees + sweep);
    return `M${ax} ${ay} A${this.ringRadius} ${this.ringRadius} 0 ${sweep > 180 ? 1 : 0} 1 ${bx} ${by}`;
  }

  /** A leader line from the ring out to a label, like a technical drawing. */
  calloutPoints(degrees: number, knee: readonly [number, number], endX: number): string {
    const [x, y] = this.point(this.calloutRadius, degrees);
    return `${x},${y} ${knee[0]},${knee[1]} ${endX},${knee[1]}`;
  }

  /** Keeps the order of older updates, and spaces today's out so the accent colour goes all the way round. */
  private static spreadToday(ticks: readonly WheelTick[]): WheelTick[] {
    const today = ticks.filter((tick) => tick.today);
    const older = ticks.filter((tick) => !tick.today);
    if (today.length === 0) return older;
    const every = Math.max(1, Math.floor(ticks.length / today.length));
    const arranged: WheelTick[] = [];
    for (let index = 0; index < ticks.length; index++) {
      const wantsToday = index % every === Math.min(3, every - 1);
      const next = wantsToday && today.length > 0 ? today.shift() : (older.shift() ?? today.shift());
      if (next) arranged.push(next);
    }
    return arranged;
  }
}
