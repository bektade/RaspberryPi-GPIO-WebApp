"""GPIO backend: WiringPi CLI (original) with lgpio fallback for modern Pi OS."""

from __future__ import annotations

import shutil
import subprocess
import threading
from typing import Optional

GPIO_COUNT = 29
_lock = threading.Lock()
_chip_handle: Optional[int] = None
_lgpio_module = None
_output_pins: set[int] = set()


def _lgpio():
    global _lgpio_module
    if _lgpio_module is None:
        import lgpio

        _lgpio_module = lgpio
    return _lgpio_module


def _wiringpi_available() -> bool:
    return shutil.which("gpio") is not None


def _lgpio_available() -> bool:
    try:
        _lgpio()
        return True
    except ImportError:
        return False


def _chip_open() -> Optional[int]:
    global _chip_handle
    if _chip_handle is None:
        try:
            _chip_handle = _lgpio().gpiochip_open(0)
        except Exception:
            return None
    return _chip_handle


def _lgpio_free(gpio: int) -> None:
    lgpio = _lgpio()
    handle = _chip_open()
    if handle is None:
        return
    try:
        lgpio.gpio_free(handle, gpio)
        _output_pins.discard(gpio)
    except lgpio.error:
        pass


def _lgpio_read(gpio: int) -> int:
    lgpio = _lgpio()
    handle = _chip_open()
    if handle is None:
        return 0
    try:
        if gpio not in _output_pins:
            try:
                lgpio.gpio_claim_input(handle, gpio, lgpio.SET_PULL_NONE)
            except lgpio.error:
                pass
        return 1 if lgpio.gpio_read(handle, gpio) else 0
    except lgpio.error:
        return 0


def _lgpio_write(gpio: int, state: int) -> int:
    lgpio = _lgpio()
    handle = _chip_open()
    if handle is None:
        return state
    try:
        if gpio not in _output_pins:
            _lgpio_free(gpio)
            lgpio.gpio_claim_output(handle, gpio, lgpio.SET_PULL_NONE)
            _output_pins.add(gpio)
        lgpio.gpio_write(handle, gpio, state)
        return 1 if lgpio.gpio_read(handle, gpio) else 0
    except lgpio.error:
        try:
            _lgpio_free(gpio)
            lgpio.gpio_claim_output(handle, gpio, lgpio.SET_PULL_NONE)
            _output_pins.add(gpio)
            lgpio.gpio_write(handle, gpio, state)
            return 1 if lgpio.gpio_read(handle, gpio) else 0
        except lgpio.error:
            return state


def _get_gpio_state_unlocked(gpio: int) -> int:
    if _wiringpi_available():
        result = subprocess.run(
            ["gpio", "-g", "read", str(gpio)],
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode == 0 and result.stdout.strip().isdigit():
            return int(result.stdout.strip())

    if _lgpio_available():
        return _lgpio_read(gpio)

    return 0


def _set_gpio_state_unlocked(gpio: int, state: int) -> int:
    state = 1 if state else 0
    if _wiringpi_available():
        subprocess.run(
            ["gpio", "-g", "mode", str(gpio), "out"],
            capture_output=True,
            check=False,
        )
        subprocess.run(
            ["gpio", "-g", "write", str(gpio), str(state)],
            capture_output=True,
            check=False,
        )
        return _get_gpio_state_unlocked(gpio)

    if _lgpio_available():
        return _lgpio_write(gpio, state)

    return state


def get_gpio_state(gpio: int) -> int:
    with _lock:
        return _get_gpio_state_unlocked(gpio)


def set_gpio_state(gpio: int, state: int) -> int:
    with _lock:
        return _set_gpio_state_unlocked(gpio, state)


def get_all_gpio_states() -> dict[int, int]:
    with _lock:
        return {i: _get_gpio_state_unlocked(i) for i in range(GPIO_COUNT)}


def close() -> None:
    global _chip_handle
    with _lock:
        if _chip_handle is not None and _lgpio_available():
            lgpio = _lgpio()
            for gpio in list(_output_pins):
                _lgpio_free(gpio)
            try:
                lgpio.gpiochip_close(_chip_handle)
            except Exception:
                pass
            _chip_handle = None
