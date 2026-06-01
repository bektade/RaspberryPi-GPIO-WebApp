# Docker Hub listing

Repo: [becktkh/rp-gpio](https://hub.docker.com/r/becktkh/rp-gpio)

---

## Repository link

In Docker Hub → **becktkh/rp-gpio** → **Settings** → **General** → **GitHub repository**, connect or paste:

```
https://github.com/timkn/Raspberry-Pi-GPIO-Control
```

Dockerfile path (if prompted): `python-gpio-control/Dockerfile`

---

## Short description

Copy this into the **Short description** field:

```
Web UI to monitor and control Raspberry Pi GPIO pins. Next.js + Flask, ARM64, port 8080.
```

---

## Full description

Copy everything below into the **Full description** field:

---

### Raspberry Pi GPIO Control

Monitor and control BCM GPIO pins from a browser. Single image — Next.js UI and Flask API.

Use it to validate relay wiring and automation prototypes (SSRs, pumps, lighting, actuators, sensors).

**Image:** `becktkh/rp-gpio`  
**Platform:** ARM64 (Raspberry Pi)  
**Web UI:** `http://<pi-ip>:8080`  
**Git repo:** https://github.com/timkn/Raspberry-Pi-GPIO-Control

#### Quick start

```
docker run -d \
  --name rp-gpio \
  --restart unless-stopped \
  --privileged \
  --device /dev/gpiomem \
  --device /dev/gpiochip0 \
  -p 8080:3000 \
  becktkh/rp-gpio:latest
```

Then open `http://<pi-ip>:8080` in a browser.

#### API

All routes are under `/api/gpio`:

- `GET /api/gpio?gpiostateall=` — read all pins (BCM 0–28)
- `GET /api/gpio?gpiostate=17` — read one pin
- `GET /api/gpio?gpio=17&state=1` — set pin and return state

#### Git repository

https://github.com/timkn/Raspberry-Pi-GPIO-Control

Apache License 2.0
