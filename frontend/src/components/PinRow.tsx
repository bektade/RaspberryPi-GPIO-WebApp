"use client";

import type { PinSide } from "@/lib/pins";
import { PinCircle } from "./PinCircle";

type PinRowProps = {
  left: PinSide;
  right: PinSide;
  leftState?: 0 | 1;
  rightState?: 0 | 1;
  onToggle: (bcm: number) => void;
  busyLeft?: boolean;
  busyRight?: boolean;
};

function gpioLabelClasses(state: 0 | 1 | undefined) {
  if (state === 1) {
    return "bg-emerald-500/90 text-white dark:bg-emerald-600";
  }
  if (state === 0) {
    return "bg-rose-500/90 text-white dark:bg-rose-600";
  }
  return "bg-transparent text-slate-800 dark:text-slate-100";
}

function staticLabelClasses(type: PinSide["type"]) {
  if (type === "power") return "text-amber-700 dark:text-amber-200/90";
  if (type === "ground") return "text-slate-500 dark:text-slate-500";
  return "text-slate-800 dark:text-slate-100";
}

function PinLabel({
  pin,
  state,
  onToggle,
  busy,
}: {
  pin: PinSide;
  state?: 0 | 1;
  onToggle: (bcm: number) => void;
  busy?: boolean;
}) {
  const isGpio = pin.type === "gpio" && pin.bcm !== undefined;
  const base =
    "min-h-[2.25rem] w-full rounded-md px-2 py-1.5 text-left text-xs leading-snug transition sm:text-[13px]";

  const labelBody = (() => {
    const match = pin.label.match(/^(GPIO \d+)(.*)$/i);
    if (match) {
      return (
        <>
          <span className="font-bold">{match[1]}</span>
          <span className="opacity-85">{match[2]}</span>
        </>
      );
    }
    return <span className="font-medium capitalize">{pin.label}</span>;
  })();

  if (!isGpio) {
    return (
      <div className={`${base} ${staticLabelClasses(pin.type)}`}>{labelBody}</div>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => onToggle(pin.bcm!)}
      className={`${base} ${gpioLabelClasses(state)} hover:brightness-105 active:scale-[0.99] disabled:opacity-60`}
      title={`BCM GPIO ${pin.bcm} · ${state === 1 ? "HIGH" : "LOW"}`}
    >
      {labelBody}
    </button>
  );
}

export function PinRow({
  left,
  right,
  leftState,
  rightState,
  onToggle,
  busyLeft,
  busyRight,
}: PinRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
      <PinLabel pin={left} state={leftState} onToggle={onToggle} busy={busyLeft} />

      <div className="flex items-center gap-1.5 rounded-md bg-slate-700/95 px-2 py-1 dark:bg-slate-800">
        <PinCircle pin={left} />
        <PinCircle pin={right} />
      </div>

      <PinLabel pin={right} state={rightState} onToggle={onToggle} busy={busyRight} />
    </div>
  );
}
