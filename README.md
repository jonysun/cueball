# Cueball Aiming Simulator

台球瞄准练习与考试模式模拟器。项目是 Vite + React 前端，生产环境通过 Docker 构建静态资源并由 nginx 提供服务。

## Local Development

```bash
npm ci
npm run dev
```

默认开发地址为 `http://localhost:5173/`，如端口占用 Vite 会自动选择下一个端口。

## Production Build

```bash
npm ci
npm run build
```

构建产物输出到 `dist/`。

## Docker

Build image:

```bash
docker build -t cueball-aiming-simulator:latest .
```

Run container:

```bash
docker run --rm -p 8080:80 cueball-aiming-simulator:latest
```

Open `http://localhost:8080/`.

## Docker Compose

```bash
docker compose up -d --build
```

默认映射到宿主机 `8080` 端口。可以通过环境变量覆盖：

```bash
APP_PORT=3000 DOCKER_IMAGE=your-dockerhub-name/cueball-aiming-simulator:latest docker compose up -d --build
```

## Publish

Push code to GitHub after configuring a remote:

```bash
git remote add origin git@github.com:<owner>/<repo>.git
git push -u origin codex/cueball-aiming-simulator
```

Push image to Docker Hub:

```bash
docker login
docker build -t <dockerhub-namespace>/cueball-aiming-simulator:latest .
docker push <dockerhub-namespace>/cueball-aiming-simulator:latest
```

## GitHub Actions Docker Publish

The workflow at `.github/workflows/docker-publish.yml` can publish the image automatically after a GitHub push.

Configure these repository secrets first:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

The published image name is:

```text
<DOCKERHUB_USERNAME>/cueball-aiming-simulator
```
