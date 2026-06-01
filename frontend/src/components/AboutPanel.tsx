export function AboutPanel() {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-surface-border dark:bg-surface-raised/50">
        <div className="divide-y divide-slate-200 dark:divide-surface-border">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Author</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              <a
                href="https://bekcsys.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
              >
                Bek Kobro
              </a>
              <span className="mx-2 text-slate-300 dark:text-slate-600">|</span>
              <a
                href="https://bekcsys.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                bekcsys.com
              </a>
            </p>
          </div>

          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Stack</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Next.js, Flask API, GPIO lgpio on Pi and WiringPi CLI
            </p>
          </div>

          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">License</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              <a
                href="https://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Apache License 2.0
              </a>
              <span className="mx-2 text-slate-300 dark:text-slate-600">·</span>
              Fork of{" "}
              <a
                href="https://github.com/timkn/Raspberry-Pi-GPIO-Control"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                timkn/Raspberry-Pi-GPIO-Control
              </a>{" "}
              (2020)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
