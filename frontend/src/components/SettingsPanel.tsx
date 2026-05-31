"use client";

import type { AppSettings } from "@/lib/pins";

type SettingsPanelProps = {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
};

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-surface-border dark:bg-surface-raised/60">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <div className="mx-auto w-full max-w-lg space-y-3">
      <Toggle
        label="Confirmation window"
        checked={settings.confirmation}
        onChange={(v) => onChange({ confirmation: v })}
      />
      <Toggle
        label="Safety mode"
        description="Before changing a pin, verify the displayed state matches hardware."
        checked={settings.safetyMode}
        onChange={(v) => onChange({ safetyMode: v })}
      />
      <Toggle
        label="Refresh after GPIO change"
        checked={settings.autoRefresh}
        onChange={(v) => onChange({ autoRefresh: v })}
      />
      <Toggle
        label="Dark mode"
        checked={settings.darkMode}
        onChange={(v) => onChange({ darkMode: v })}
      />
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-surface-border dark:bg-surface-raised/40 dark:text-slate-500">
        <p className="font-medium text-slate-600 dark:text-slate-400">Requirements</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Run on Raspberry Pi (native or Docker)</li>
          <li>WiringPi CLI or lgpio for GPIO access</li>
          <li>All BCM GPIO pins are togglable as outputs for relay modules</li>
          <li>
            <a
              href="https://www.raspberrypi.org/documentation/usage/gpio/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              BCM pin numbering reference
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
