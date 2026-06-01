"use client";

import type { AppSettings } from "@/lib/pins";

type SettingsPanelProps = {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
};

function ToggleRow({
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
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-surface-border dark:bg-surface-raised/50">
        <div className="divide-y divide-slate-200 dark:divide-surface-border">
          <ToggleRow
            label="Confirmation window"
            description="Ask before toggling a pin or using All GPIO ON/OFF."
            checked={settings.confirmation}
            onChange={(v) => onChange({ confirmation: v })}
          />
          <ToggleRow
            label="Safety mode"
            description="Before changing a pin, verify the displayed state matches hardware."
            checked={settings.safetyMode}
            onChange={(v) => onChange({ safetyMode: v })}
          />
          <ToggleRow
            label="Refresh after GPIO change"
            description="Re-read all pin states from the Pi after each toggle."
            checked={settings.autoRefresh}
            onChange={(v) => onChange({ autoRefresh: v })}
          />
          <ToggleRow
            label="Dark mode"
            checked={settings.darkMode}
            onChange={(v) => onChange({ darkMode: v })}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-surface-border dark:bg-surface-raised/50">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Tips</p>
        <ul className="mt-2 list-inside list-disc space-y-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <li>
            <span className="font-medium text-slate-700 dark:text-slate-300">Refresh</span> re-reads every GPIO
            state from the Pi and updates the board. Use the Refresh button if a pin changed outside this app.
          </li>
          <li>GPIO access uses WiringPi CLI or lgpio on the Pi.</li>
          <li>
            <a
              href="https://pinout.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              BCM pin numbering reference (pinout.xyz)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
