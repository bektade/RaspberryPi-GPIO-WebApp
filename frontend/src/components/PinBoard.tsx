"use client";

import { useState } from "react";
import { PIN_ROWS } from "@/lib/pins";
import type { GpioStates } from "@/lib/pins";
import { PinCell } from "./PinCell";

type PinBoardProps = {
  states: GpioStates;
  onToggle: (bcm: number) => Promise<void>;
  onRefresh: () => void;
  refreshing: boolean;
};

export function PinBoard({ states, onToggle, onRefresh, refreshing }: PinBoardProps) {
  const [busyPin, setBusyPin] = useState<number | null>(null);

  const handleToggle = async (bcm: number) => {
    setBusyPin(bcm);
    try {
      await onToggle(bcm);
    } finally {
      setBusyPin(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            High · relay on
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Low · relay off
          </span>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50 dark:border-surface-border dark:bg-surface-raised dark:text-slate-300 dark:hover:text-white"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-surface-border dark:bg-surface-raised/50 dark:shadow-xl dark:shadow-black/20">
        <div className="mb-2 flex justify-between px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <span>Pin 1 — left</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span>right — Pin 2</span>
        </div>
        <div className="flex flex-col gap-1">
          {PIN_ROWS.map((row) => (
            <div key={row.left.physical} className="grid grid-cols-2 gap-1.5">
              <PinCell
                pin={row.left}
                align="left"
                state={row.left.bcm !== undefined ? states[row.left.bcm] : undefined}
                onToggle={handleToggle}
                busy={busyPin === row.left.bcm}
              />
              <PinCell
                pin={row.right}
                align="right"
                state={row.right.bcm !== undefined ? states[row.right.bcm] : undefined}
                onToggle={handleToggle}
                busy={busyPin === row.right.bcm}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
          Tap any GPIO row to toggle output — drives relay modules wired to that pin
        </p>
      </div>
    </div>
  );
}
