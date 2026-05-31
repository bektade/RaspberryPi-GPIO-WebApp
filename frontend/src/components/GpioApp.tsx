"use client";

import { useCallback, useEffect, useState } from "react";
import { AboutPanel } from "@/components/AboutPanel";
import { PinBoard } from "@/components/PinBoard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { fetchAllStates, fetchPinState, setPinState } from "@/lib/gpio-api";
import { DEFAULT_SETTINGS, type AppSettings, type GpioStates } from "@/lib/pins";

type Tab = "gpio" | "settings" | "about";

const TABS: { id: Tab; label: string }[] = [
  { id: "gpio", label: "GPIO" },
  { id: "settings", label: "Settings" },
  { id: "about", label: "About" },
];

export function GpioApp() {
  const [tab, setTab] = useState<Tab>("gpio");
  const [states, setStates] = useState<GpioStates>({});
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [refreshing, setRefreshing] = useState(false);

  const applyTheme = useCallback((dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useEffect(() => {
    applyTheme(settings.darkMode);
  }, [settings.darkMode, applyTheme]);

  const loadAll = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchAllStates();
      setStates(data);
    } catch {
      /* offline */
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const patchSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const togglePin = async (bcm: number) => {
    try {
      const live = await fetchPinState(bcm);

      if (settings.safetyMode && states[bcm] !== undefined && states[bcm] !== live) {
        alert(`The GPIO was already in status: ${live}`);
        setStates((prev) => ({ ...prev, [bcm]: live }));
        return;
      }

      const next: 0 | 1 = live === 0 ? 1 : 0;
      const action = next === 1 ? "ON (HIGH)" : "OFF (LOW)";

      if (settings.confirmation && !confirm(`Toggle GPIO ${bcm} → ${action}?`)) return;

      const verified = await setPinState(bcm, next);
      setStates((prev) => ({ ...prev, [bcm]: verified }));

      if (settings.autoRefresh) await loadAll();
    } catch {
      alert("Error when the GPIO state was changed.");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-surface-border dark:bg-surface/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-sm font-semibold tracking-wide text-slate-800 dark:text-white">
              Raspberry Pi GPIO
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">BCM numbering · tap to toggle relays</p>
          </div>
          <nav className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-surface-border dark:bg-surface-raised">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  tab === id
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-4">
        {tab === "gpio" && (
          <PinBoard states={states} onToggle={togglePin} onRefresh={loadAll} refreshing={refreshing} />
        )}
        {tab === "settings" && <SettingsPanel settings={settings} onChange={patchSettings} />}
        {tab === "about" && <AboutPanel />}
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-surface-border dark:bg-surface">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <a
            href="https://bekcsys.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
          >
            Bek Kobro
          </a>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
          <a
            href="https://bekcsys.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            bekcsys.com
          </a>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
          <a
            href="https://github.com/timkn/Raspberry-Pi-GPIO-Control"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            timkn/Raspberry-Pi-GPIO-Control
          </a>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-400">without guarantee</span>
        </div>
      </footer>
    </>
  );
}
