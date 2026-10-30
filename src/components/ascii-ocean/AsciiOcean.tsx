"use client";

import { useEffect, useRef } from "react";
import { defaultConfig, OceanEngine, type OceanConfig, type SharkSpec } from "./ocean-engine";

const SHARKS = [
  "classic",
  "hammerhead",
  "greathammer",
  "tiger",
  "zebra",
  "mako",
  "thresher",
  "nurse",
] as const;

const FISH = ["mixed", "sardine", "anchovy", "silverside", "mackerel", "goby"] as const;

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

type Rgb = [number, number, number];

export type AsciiOceanProps = {
  sharkType?: (typeof SHARKS)[number] | "mix";
  sharkCount?: number;
  sharkSize?: number;
  fishCount?: number;
  fishType?: (typeof FISH)[number];
  speed?: number;
  cellSize?: number;
  background?: string;
  showGrid?: boolean;
  gridColor?: string;
  fishColor?: string;
  wakeColor?: string;
  sharkColor?: string;
  accentColors?: string[];
  sharkChars?: string;
  fishChar?: string;
  interactive?: boolean;
  paused?: boolean;
  decorative?: boolean;
  className?: string;
  label?: string;
};

function parseColor(input: string | undefined, fallback: Rgb): Rgb {
  if (!input) return fallback;
  const rgb = input.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (rgb) return [Math.round(+rgb[1]), Math.round(+rgb[2]), Math.round(+rgb[3])];
  const hex = input.match(/#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})(?![0-9a-f])/i);
  if (!hex) return fallback;
  let h = hex[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function css(color: Rgb) {
  return `rgb(${color[0]},${color[1]},${color[2]})`;
}

function buildRoster(type: string, count: number, size: number): SharkSpec[] {
  const roster: SharkSpec[] = [];
  for (let i = 0; i < count; i++) {
    const kind = type === "mix" ? SHARKS[i % SHARKS.length] : type;
    roster.push({ kind, size: Math.max(0.45, 1 - i * 0.09) * size });
  }
  return roster;
}

export function AsciiOcean({
  sharkType = "classic",
  sharkCount = 4,
  sharkSize = 1,
  fishCount = 180,
  fishType = "mixed",
  speed = 1,
  cellSize = 0,
  background = "#000000",
  showGrid = true,
  gridColor = "#ffffff",
  fishColor = "#e6eeff",
  wakeColor = "#6ee6ff",
  sharkColor,
  accentColors,
  sharkChars = ":;t%SX8#@",
  fishChar = "-",
  interactive = true,
  paused = false,
  decorative = false,
  className,
  label = "ASCII ocean",
}: AsciiOceanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<OceanEngine | null>(null);
  const cfgRef = useRef<OceanConfig>(defaultConfig());

  const transparent = background === "transparent";
  const bg = transparent ? ([0, 0, 0] as [number, number, number]) : parseColor(background, [0, 0, 0]);
  const grid = parseColor(gridColor, [255, 255, 255]);
  const sc = parseColor(sharkColor, [120, 160, 220]);
  const sMax = Math.max(sc[0], sc[1], sc[2], 1);
  const accents = (accentColors?.length ? accentColors : defaultConfig().accents).map((color) =>
    css(parseColor(color, [255, 255, 255])),
  );

  const next: OceanConfig = {
    background: transparent ? "transparent" : css(bg),
    showGrid,
    gridColor: `rgba(${grid[0]},${grid[1]},${grid[2]},0.12)`,
    fishRGB: parseColor(fishColor, [230, 238, 255]),
    wakeRGB: parseColor(wakeColor, [110, 230, 255]),
    sharkTint: sharkColor ? [sc[0] / sMax * 1.05, sc[1] / sMax * 1.05, sc[2] / sMax * 1.05] : null,
    accents,
    ramp: sharkChars.length > 0 ? sharkChars : ":;t%SX8#@",
    fishGlyph: fishChar.length > 0 ? fishChar[0] : "-",
    speed: Math.max(0.05, speed),
    cellSize: Math.round(cellSize),
    interactive,
    fishSpecies: Math.max(-1, FISH.indexOf(fishType) - 1),
  };
  const liveKey = JSON.stringify(next);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new OceanEngine(
      canvas,
      buildRoster(sharkType, sharkCount, sharkSize),
      fishCount,
      cfgRef.current,
    );
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [fishCount, fishType, sharkCount, sharkSize, sharkType]);

  useEffect(() => {
    Object.assign(cfgRef.current, JSON.parse(liveKey) as OceanConfig);
    engineRef.current?.updateConfig();
  }, [liveKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => engineRef.current?.setRunning(!paused), paused ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [paused]);

  return (
    <div
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        background: transparent ? "transparent" : css(bg),
        fontFamily: MONO,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%", fontFamily: MONO }}
      />
    </div>
  );
}
