export type PinType = "gpio" | "power" | "ground";

export type PinSide = {
  physical: number;
  label: string;
  bcm?: number;
  type: PinType;
};

export type PinRow = {
  left: PinSide;
  right: PinSide;
};

export const PIN_ROWS: PinRow[] = [
  {
    left: { physical: 1, label: "3V3 power", type: "power" },
    right: { physical: 2, label: "5V power", type: "power" },
  },
  {
    left: { physical: 3, label: "GPIO 2 · SDA", bcm: 2, type: "gpio" },
    right: { physical: 4, label: "5V power", type: "power" },
  },
  {
    left: { physical: 5, label: "GPIO 3 · SCL", bcm: 3, type: "gpio" },
    right: { physical: 6, label: "Ground", type: "ground" },
  },
  {
    left: { physical: 7, label: "GPIO 4 · GPCLK0", bcm: 4, type: "gpio" },
    right: { physical: 8, label: "GPIO 14 · TXD", bcm: 14, type: "gpio" },
  },
  {
    left: { physical: 9, label: "Ground", type: "ground" },
    right: { physical: 10, label: "GPIO 15 · RXD", bcm: 15, type: "gpio" },
  },
  {
    left: { physical: 11, label: "GPIO 17", bcm: 17, type: "gpio" },
    right: { physical: 12, label: "GPIO 18 · PCM_CLK", bcm: 18, type: "gpio" },
  },
  {
    left: { physical: 13, label: "GPIO 27", bcm: 27, type: "gpio" },
    right: { physical: 14, label: "Ground", type: "ground" },
  },
  {
    left: { physical: 15, label: "GPIO 22", bcm: 22, type: "gpio" },
    right: { physical: 16, label: "GPIO 23", bcm: 23, type: "gpio" },
  },
  {
    left: { physical: 17, label: "3V3 power", type: "power" },
    right: { physical: 18, label: "GPIO 24", bcm: 24, type: "gpio" },
  },
  {
    left: { physical: 19, label: "GPIO 10 · MOSI", bcm: 10, type: "gpio" },
    right: { physical: 20, label: "Ground", type: "ground" },
  },
  {
    left: { physical: 21, label: "GPIO 9 · MISO", bcm: 9, type: "gpio" },
    right: { physical: 22, label: "GPIO 25", bcm: 25, type: "gpio" },
  },
  {
    left: { physical: 23, label: "GPIO 11 · SCLK", bcm: 11, type: "gpio" },
    right: { physical: 24, label: "GPIO 8 · CE0", bcm: 8, type: "gpio" },
  },
  {
    left: { physical: 25, label: "Ground", type: "ground" },
    right: { physical: 26, label: "GPIO 7 · CE1", bcm: 7, type: "gpio" },
  },
  {
    left: { physical: 27, label: "GPIO 0 · ID_SD", bcm: 0, type: "gpio" },
    right: { physical: 28, label: "GPIO 1 · ID_SC", bcm: 1, type: "gpio" },
  },
  {
    left: { physical: 29, label: "GPIO 5", bcm: 5, type: "gpio" },
    right: { physical: 30, label: "Ground", type: "ground" },
  },
  {
    left: { physical: 31, label: "GPIO 6", bcm: 6, type: "gpio" },
    right: { physical: 32, label: "GPIO 12 · PWM0", bcm: 12, type: "gpio" },
  },
  {
    left: { physical: 33, label: "GPIO 13 · PWM1", bcm: 13, type: "gpio" },
    right: { physical: 34, label: "Ground", type: "ground" },
  },
  {
    left: { physical: 35, label: "GPIO 19 · PCM_FS", bcm: 19, type: "gpio" },
    right: { physical: 36, label: "GPIO 16", bcm: 16, type: "gpio" },
  },
  {
    left: { physical: 37, label: "GPIO 26", bcm: 26, type: "gpio" },
    right: { physical: 38, label: "GPIO 20 · PCM_DIN", bcm: 20, type: "gpio" },
  },
  {
    left: { physical: 39, label: "Ground", type: "ground" },
    right: { physical: 40, label: "GPIO 21 · PCM_DOUT", bcm: 21, type: "gpio" },
  },
];

export type GpioStates = Record<number, 0 | 1>;

export type AppSettings = {
  confirmation: boolean;
  safetyMode: boolean;
  autoRefresh: boolean;
  darkMode: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  confirmation: false,
  safetyMode: true,
  autoRefresh: false,
  darkMode: false,
};

/** Every BCM line on the 40-pin header that can drive a relay. */
export const BCM_GPIO_PINS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
] as const;
