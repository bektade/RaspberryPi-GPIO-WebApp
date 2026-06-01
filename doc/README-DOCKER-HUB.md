# Publish to Docker Hub

One image: **`becktkh/rp-gpio`** — Flask API + Next.js UI. Build on a Pi (ARM64).

```bash
cp .env.example .env          # DOCKER_USER=your-hub-username
make login
make publish                  # TAG=1.0.0 make publish
```

Run (no build): `make hub-up` or `./scripts/hub-run.sh` → http://\<pi-ip\>:8080

Hub listing text: **[dockerhub-overview.md](dockerhub-overview.md)**
