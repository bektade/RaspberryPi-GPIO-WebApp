# Python GPIO Control

Next.js frontend + Flask GPIO API. Fork of [timkn/Raspberry-Pi-GPIO-Control](https://github.com/timkn/Raspberry-Pi-GPIO-Control) (PHP), customized by **Bek kobro**.

```bash
make help
```

## Quick start

```bash
make up          # Docker — Next.js on :8080, Flask API internal
make dev         # local — API :5000 + Next.js :3000 (needs npm install in frontend/)
```

Open **http://\<pi-ip\>:8080**

## Stack

| Layer | Tech |
|-------|------|
| UI | Next.js 15, React, Tailwind |
| API | Flask, lgpio / WiringPi |
| Deploy | Docker Compose |

## Dev setup

```bash
make install
cd frontend && npm install
make dev
```

- UI → http://localhost:3000  
- API → http://localhost:5000/api/gpio  

## API

| Request | Response |
|---------|----------|
| `GET /api/gpio?gpiostateall=` | All BCM states 0–28 |
| `GET /api/gpio?gpiostate=17` | Single pin |
| `GET /api/gpio?gpio=17&state=1` | Set pin, return verified state |

## Layout

```
python-gpio-control/
├── frontend/          Next.js app
├── app.py             Flask API
├── gpio_backend.py
├── docker-compose.yml
├── Dockerfile.api
└── Makefile
```
