"use client";

import type { PinSide } from "@/lib/pins";

type PinCellProps = {
  pin: PinSide;
  align: "left" | "right";
  state?: 0 | 1;
  onToggle?: (bcm: number) => void;
  busy?: boolean;
};

export function PinCell({ pin, align, state, onToggle, busy }: PinCellProps) {
  const isGpio = pin.type === "gpio" && pin.bcm !== undefined;
  const isHigh = state === 1;
  const isLow = state === 0;

  const base =
    "group flex h-8 w-full items-center gap-2 rounded-md border px-2 transition-all duration-200";

  const inactive =
    pin.type === "power"
      ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200/90"
      : pin.type === "ground"
        ? "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-600/40 dark:bg-slate-800/60 dark:text-slate-500"
        : "";

  const gpioStyle = isHigh
    ? "border-emerald-300 bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 dark:border-emerald-400/50 dark:shadow-emerald-500/30"
    : isLow
      ? "border-rose-300 bg-rose-500 text-white shadow-sm shadow-rose-500/15 dark:border-red-400/40 dark:shadow-red-500/20"
      : "border-slate-200 bg-white text-slate-700 dark:border-surface-border dark:bg-surface-raised dark:text-slate-300";

  const layout = align === "left" ? "flex-row" : "flex-row-reverse text-right";

  if (!isGpio) {
    return (
      <div className={`${base} ${inactive} ${layout}`}>
        <span className="pin-num shrink-0 rounded bg-black/5 px-1.5 py-0.5 dark:bg-black/20">{pin.physical}</span>
        <span className="pin-label flex-1 opacity-90">{pin.label}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => onToggle?.(pin.bcm!)}
      className={`${base} ${gpioStyle} ${layout} hover:brightness-105 active:scale-[0.98] disabled:opacity-60`}
      title={`Toggle BCM ${pin.bcm} — relay ${isHigh ? "ON" : "OFF"}`}
    >
      <span className="pin-num shrink-0 rounded bg-black/10 px-1.5 py-0.5 dark:bg-black/15">{pin.physical}</span>
      <span className="pin-label flex-1">{pin.label}</span>
      <span className="pin-num shrink-0 opacity-80">{isHigh ? "HIGH" : "LOW"}</span>
    </button>
  );
}
