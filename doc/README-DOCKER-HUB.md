# Publish to Docker Hub

This guide explains how to build and publish the GPIO Control stack to [Docker Hub](https://hub.docker.com/) so others can pull and run pre-built images on a Raspberry Pi without cloning or building locally.

## Published images

Images are published under the [becktkh](https://hub.docker.com/u/becktkh) namespace:

| Image | Description |
|-------|-------------|
| `becktkh/rp-gpio-api:latest` | Flask GPIO API |
| `becktkh/rp-gpio-web:latest` | Next.js web UI |

Replace `becktkh` with your Docker Hub username when publishing under your own account.

## Prerequisites

- Docker and Docker Compose installed on the build machine
- A [Docker Hub](https://hub.docker.com/) account
- This repository cloned (or at least the `python-gpio-control/` directory)
- GPIO device access is **not** required to build or push — only to run the API container on a Pi

### Platform note

Images are built for the CPU architecture of the machine running `make publish`. For Raspberry Pi deployments, build and push **on the Pi** (or another ARM64 machine) so images match `linux/arm64`. Images built on x86_64 will not run on a Pi unless you set up multi-arch builds separately.

## One-time setup

From the project root:

```bash
cd python-gpio-control
cp .env.example .env
```

Edit `.env` if your Docker Hub username is not `becktkh`:

```env
DOCKER_USER=your-dockerhub-username
TAG=latest
PORT=8080
```

Create the two repositories on Docker Hub (if they do not exist yet):

- `<DOCKER_USER>/rp-gpio-api`
- `<DOCKER_USER>/rp-gpio-web`

Set each repository to **Public** if you want others to pull without authentication.

Log in to Docker Hub:

```bash
make login
```

Enter your Docker Hub username and password (or access token) when prompted.

## Build and push

Build both images and push them to Docker Hub:

```bash
make publish
```

This runs `docker compose build` followed by `docker compose push` for both services.

### Push a version tag

To publish a specific release tag instead of `latest`:

```bash
TAG=1.0.0 make publish
```

This pushes:

- `<DOCKER_USER>/rp-gpio-api:1.0.0`
- `<DOCKER_USER>/rp-gpio-web:1.0.0`

You can push both `latest` and a version tag by running `make publish` twice with different `TAG` values.

### Build without pushing

To build locally and verify before pushing:

```bash
make build
docker images | grep rp-gpio
```

Then push when ready:

```bash
make publish
```

## Verify on Docker Hub

After pushing, confirm both repositories appear on your Docker Hub profile:

- `https://hub.docker.com/r/<DOCKER_USER>/rp-gpio-api`
- `https://hub.docker.com/r/<DOCKER_USER>/rp-gpio-web`

Check that the tag you pushed (for example `latest` or `1.0.0`) is listed under **Tags**.

## What end users run

Once images are public, users can pull and start without building:

**From a clone:**

```bash
cp .env.example .env    # set DOCKER_USER to your Docker Hub namespace
make hub-up             # pull images and start
```

**One-liner (no clone):**

```bash
curl -fsSL https://raw.githubusercontent.com/bektade/RaspberryPi-GPIO-WebApp/master/python-gpio-control/scripts/hub-run.sh | bash
```

Open **http://\<pi-ip\>:8080** in a browser.

The curl script installs to `~/.rp-gpio-control/` and pulls the default images `becktkh/rp-gpio-api:latest` and `becktkh/rp-gpio-web:latest`. Override with environment variables:

```bash
DOCKER_USER=yourname TAG=1.0.0 PORT=8080 curl -fsSL .../hub-run.sh | bash
```

## Makefile reference

| Command | Description |
|---------|-------------|
| `make login` | Log in to Docker Hub (`docker login`) |
| `make build` | Build images locally |
| `make publish` | Build and push both images to Docker Hub |
| `make push` | Alias for `publish` |
| `make hub-pull` | Pull pre-built images only |
| `make hub-up` | Pull and start (no local build) |
| `make hub-down` | Stop the pull-only stack |

Run `make help` for the full command list.

## Files involved

| File | Role |
|------|------|
| `docker-compose.yml` | Build definitions and image tags for publish |
| `docker-compose.hub.yml` | Pull-only compose file (no `build:`) |
| `Dockerfile.api` | Flask API image |
| `frontend/Dockerfile` | Next.js web UI image |
| `.env.example` | Default `DOCKER_USER`, `TAG`, and `PORT` |
| `Makefile` | `login`, `build`, `publish`, and `hub-*` targets |
| `scripts/hub-run.sh` | One-command install script for end users |

## Troubleshooting

**`denied: requested access to the resource is denied`**

- Run `make login` and confirm you are logged in as the same user as `DOCKER_USER` in `.env`.
- Ensure the repositories exist on Docker Hub under your account.

**Push succeeds but `make hub-up` fails on another machine**

- Confirm the target machine matches the image architecture (build on Pi for Pi).
- Confirm repositories are public, or run `docker login` on the target machine.

**API container starts but GPIO does not work**

- GPIO access is a runtime concern, not a publish step. The API container needs `/dev/gpiomem` and `/dev/gpiochip0` (see `docker-compose.hub.yml`). Run on a Raspberry Pi with the compose file’s `privileged` and `devices` settings.

## Related documentation

- [Main README](README.md) — project overview and quick start
- [Docker Hub profile](https://hub.docker.com/u/becktkh)
