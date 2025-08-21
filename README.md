## Space App (React + TS + Vite)

### Yêu cầu

- Docker + Docker Compose V2
- Sao chép `.env.example` → `.env` (chỉnh biến nếu cần)

### Chạy Development (Vite dev server)

```bash
docker compose down
docker compose up --build
```

### Chạy Production (build local từ Dockerfile)

```bash
docker compose down
docker compose up --build -d
```
