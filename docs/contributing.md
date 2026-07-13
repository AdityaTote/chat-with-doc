# Contributing

## Getting Started

1. Fork the repo and create a feature branch off `main`.
2. Follow the setup guide in [docs/setup.md](./setup.md).

## Standards

**Backend (Python)**
- Formatter: `black` (line length 88, target Python 3.10)
- Run before opening a PR: `just ci` (runs `black --check`)
- All schema / model changes **must** include an Alembic migration:
  ```bash
  cd apps/backend
  uv run alembic revision --autogenerate -m "describe your change"
  ```

**Frontend (TypeScript)**
- Linter: ESLint with `eslint-config-next`
- Run before opening a PR: `bun lint`

## PR Guidelines

- Keep PRs focused — one concern per PR.
- Update `docs/` if your change affects architecture, configuration, or API shape.
- Migrations must be committed alongside model changes; never ship a model change without one.
