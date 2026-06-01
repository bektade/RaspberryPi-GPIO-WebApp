"use client";

import { useCallback, useEffect, useState } from "react";
import { AboutPanel } from "@/components/AboutPanel";
import { PinBoard } from "@/components/PinBoard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { fetchAllStates, fetchPinState, setPinState } from "@/lib/gpio-api";
import { DEFAULT_SETTINGS, BCM_GPIO_PINS, type AppSettings, type GpioStates } from "@/lib/pins";

export function GpioApp() {
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

  const setAllGpio = async (state: 0 | 1) => {
    try {
      const label = state === 1 ? "ON (HIGH)" : "OFF (LOW)";
      if (settings.confirmation && !confirm(`Turn ALL GPIO pins ${label}?`)) return;

      for (const bcm of BCM_GPIO_PINS) {
        const verified = await setPinState(bcm, state);
        setStates((prev) => ({ ...prev, [bcm]: verified }));
      }

      await loadAll();
    } catch {
      alert("Error when GPIO states were changed.");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-surface-border dark:bg-surface/95">
        <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="text-base font-semibold text-slate-800 dark:text-white">Raspberry Pi GPIO</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">40-pin header · BCM · relay control</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <a href="#gpio" className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-raised xl:hidden">
              GPIO
            </a>
            <a href="#settings" className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-raised xl:hidden">
              Settings
            </a>
            <a href="#about" className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-raised xl:hidden">
              About
            </a>
            <a
              href="https://bekcsys.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-blue-600 hover:underline sm:inline dark:text-blue-400"
            >
              bekcsys.com
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-5 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:gap-8">
          <aside
            id="settings"
            className="order-2 xl:order-1 xl:col-span-3 xl:sticky xl:top-[4.5rem] xl:self-start xl:max-h-[calc(100vh-5.5rem)] xl:overflow-y-auto"
          >
            <PanelShell title="Settings">
              <SettingsPanel settings={settings} onChange={patchSettings} />
            </PanelShell>
          </aside>

          <section id="gpio" className="order-1 xl:order-2 xl:col-span-6">
            <PanelShell title="GPIO Control">
              <PinBoard
                states={states}
                onToggle={togglePin}
                onSetAll={setAllGpio}
                onRefresh={loadAll}
                refreshing={refreshing}
              />
            </PanelShell>
          </section>

          <aside
            id="about"
            className="order-3 xl:col-span-3 xl:sticky xl:top-[4.5rem] xl:self-start xl:max-h-[calc(100vh-5.5rem)] xl:overflow-y-auto"
          >
            <PanelShell title="About">
              <AboutPanel />
            </PanelShell>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-4 dark:border-surface-border dark:bg-surface">
        <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <a
            href="https://bekcsys.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
          >
            Bek Kobro
          </a>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <a
            href="https://bekcsys.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            bekcsys.com
          </a>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-400">without guarantee</span>
        </div>
      </footer>
    </>
  );
}

function PanelShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-surface-border dark:bg-surface/40 sm:p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      {children}
    </div>
  );
}
