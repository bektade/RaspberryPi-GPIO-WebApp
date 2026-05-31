"""Flask GPIO API for the Next.js frontend."""

from __future__ import annotations

import atexit

from flask import Flask, jsonify, request
from flask_cors import CORS

import gpio_backend

app = Flask(__name__)
CORS(app)
atexit.register(gpio_backend.close)


@app.get("/api/gpio")
def api_gpio():
    gpio = request.args.get("gpio")
    state = request.args.get("state")
    if gpio is not None and state is not None:
        gpio_num = int(gpio)
        gpio_state = int(state)
        return jsonify(
            {
                "gpio": gpio_num,
                "state": gpio_backend.set_gpio_state(gpio_num, gpio_state),
            }
        )

    gpiostate = request.args.get("gpiostate")
    if gpiostate is not None:
        gpio_num = int(gpiostate)
        return jsonify(
            {
                "gpio": gpio_num,
                "state": gpio_backend.get_gpio_state(gpio_num),
            }
        )

    if "gpiostateall" in request.args:
        return jsonify(gpio_backend.get_all_gpio_states())

    return jsonify({"error": "missing query parameter"}), 400


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
