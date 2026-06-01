"use client";

import { useState } from "react";
import { BCM_GPIO_PINS, PIN_ROWS } from "@/lib/pins";
import type { GpioStates } from "@/lib/pins";
import { PinRow } from "./PinRow";

type PinBoardProps = {
  states: GpioStates;
  onToggle: (bcm: number) => Promise<void>;
  onSetAll: (state: 0 | 1) => Promise<void>;
  onRefresh: () => void;
  refreshing: boolean;
};

export function PinBoard({ states, onToggle, onSetAll, onRefresh, refreshing }: PinBoardProps) {
  const [busyPin, setBusyPin] = useState<number | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const handleToggle = async (bcm: number) => {
    setBusyPin(bcm);
    try {
      await onToggle(bcm);
    } finally {
      setBusyPin(null);
    }
  };

  const handleSetAll = async (state: 0 | 1) => {
    setBulkBusy(true);
    try {
      await onSetAll(state);
    } finally {
      setBulkBusy(false);
    }
  };

  const disabled = refreshing || bulkBusy || busyPin !== null;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          High
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Low
        </span>
        <button
          type="button"
          onClick={() => handleSetAll(1)}
          disabled={disabled}
          className="shrink-0 whitespace-nowrap rounded-lg border border-emerald-300 bg-emerald-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-600 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
        >
          All GPIO ON
        </button>
        <button
          type="button"
          onClick={() => handleSetAll(0)}
          disabled={disabled}
          className="shrink-0 whitespace-nowrap rounded-lg border border-rose-300 bg-rose-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-rose-600 disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
        >
          All GPIO OFF
        </button>
        <button
          type="button"
          onClick={onRefresh}
          disabled={disabled}
          className="shrink-0 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50 dark:border-surface-border dark:bg-surface-raised dark:text-slate-300 sm:px-4 sm:py-2 sm:text-sm"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-emerald-950/20 p-3 shadow-sm sm:p-4 dark:border-surface-border dark:bg-emerald-950/30">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          <span className="text-left">Labels</span>
          <span className="text-center text-slate-400">Pins</span>
          <span className="text-left">Labels</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {PIN_ROWS.map((row) => (
            <PinRow
              key={row.left.physical}
              left={row.left}
              right={row.right}
              leftState={row.left.bcm !== undefined ? states[row.left.bcm] : undefined}
              rightState={row.right.bcm !== undefined ? states[row.right.bcm] : undefined}
              onToggle={handleToggle}
              busyLeft={busyPin === row.left.bcm || bulkBusy}
              busyRight={busyPin === row.right.bcm || bulkBusy}
            />
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          {BCM_GPIO_PINS.length} GPIO lines · center = physical pins · tap labels to toggle
        </p>
      </div>
    </div>
  );
}
