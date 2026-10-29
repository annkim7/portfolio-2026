export type OceanConfig = {
  background: string;
  showGrid: boolean;
  gridColor: string;
  fishRGB: [number, number, number];
  wakeRGB: [number, number, number];
  sharkTint: [number, number, number] | null;
  accents: string[];
  ramp: string;
  fishGlyph: string;
  speed: number;
  cellSize: number;
  interactive: boolean;
  fishSpecies: number;
};

export type SharkSpec = {
  kind: string;
  size: number;
};

export declare function defaultConfig(): OceanConfig;

export declare class OceanEngine {
  cfg: OceanConfig;
  constructor(
    canvas: HTMLCanvasElement,
    sharks: SharkSpec[],
    fishCount: number | undefined,
    cfg?: OceanConfig,
  );
  updateConfig(): void;
  destroy(): void;
}
