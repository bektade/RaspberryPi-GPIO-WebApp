"use client";

import type { PinSide } from "@/lib/pins";

type PinCircleProps = {
  pin: PinSide;
};

function pinFillClass(type: PinSide["type"]) {
  if (type === "power") return "bg-red-600";
  if (type === "ground") return "bg-emerald-600";
  return "bg-black";
}

export function PinCircle({ pin }: PinCircleProps) {
  const isSquare = pin.physical === 1;

  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold tabular-nums text-white ${pinFillClass(pin.type)} ${
        isSquare ? "rounded-md" : "rounded-full"
      }`}
      title={`Physical pin ${pin.physical}`}
    >
      {pin.physical}
    </span>
  );
}
