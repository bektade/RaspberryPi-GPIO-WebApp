# Publish to Docker Hub (lean)

```bash
cd python-gpio-control
cp .env.example .env
```

Set your Docker Hub user in `.env`:

```env
DOCKER_USER=your-dockerhub-username
TAG=latest
PORT=8091
```

Login and publish:

```bash
make login
make publish
```

Version tag:

```bash
TAG=1.0.0 make publish
```

Run pulled image (no local build):

```bash
make hub-up
```
