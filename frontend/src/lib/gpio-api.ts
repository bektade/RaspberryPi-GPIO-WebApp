import type { GpioStates } from "./pins";

const API = "/api/gpio";

function normalizeStates(raw: Record<string, number>): GpioStates {
  const states: GpioStates = {};
  for (const [key, value] of Object.entries(raw)) {
    states[Number(key)] = (value ? 1 : 0) as 0 | 1;
  }
  return states;
}

export async function fetchAllStates(): Promise<GpioStates> {
  const res = await fetch(`${API}?gpiostateall=`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch GPIO states");
  return normalizeStates(await res.json());
}

export async function fetchPinState(bcm: number): Promise<0 | 1> {
  const res = await fetch(`${API}?gpiostate=${bcm}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to read GPIO ${bcm}`);
  const data = await res.json();
  return data.state ? 1 : 0;
}

export async function setPinState(bcm: number, state: 0 | 1): Promise<0 | 1> {
  const res = await fetch(`${API}?gpio=${bcm}&state=${state}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to set GPIO ${bcm}`);
  const data = await res.json();
  return data.state ? 1 : 0;
}
