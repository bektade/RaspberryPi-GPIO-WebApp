export function AboutPanel() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 text-center shadow-sm dark:border-surface-border dark:from-surface-raised dark:to-surface dark:shadow-lg">
        <a
          href="https://bekcsys.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-slate-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
        >
          Bek Kobro
        </a>
        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
          <a href="https://bekcsys.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
            bekcsys.com
          </a>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Python rewrite and UI customization for modern Raspberry Pi OS.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["Python", "Flask", "Next.js", "Docker", "lgpio"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-surface-border dark:bg-surface dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-surface-border dark:bg-surface-raised/50">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Origin</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Forked from{" "}
          <a
            href="https://github.com/timkn/Raspberry-Pi-GPIO-Control"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            timkn/Raspberry-Pi-GPIO-Control
          </a>{" "}
          by TK (2020) — the original PHP + WiringPi browser GPIO controller.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-surface-border dark:bg-surface-raised/50">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Stack</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Next.js frontend, Flask API, GPIO via lgpio or WiringPi. Tap any GPIO pin to toggle relay output
          from any device on your LAN.
        </p>
      </div>
    </div>
  );
}
