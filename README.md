# create-arc-web

[![npm](https://img.shields.io/npm/v/create-arc-web)](https://www.npmjs.com/package/create-arc-web)
[![Node ≥20](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![CI](https://github.com/arc-language/create-arc-web/actions/workflows/ci.yml/badge.svg)](https://github.com/arc-language/create-arc-web/actions/workflows/ci.yml)

Zero-dependency project scaffolder for [Arc](https://arc-lang.dev). Interactive wizard with arrow-key menus, 5 built-in templates, and auto-detected package manager.

```bash
npx create-arc-web
```

## Features

- **Interactive wizard** — arrow-key menus for template, package manager, and install preference
- **5 templates** — static site, counter, blog, full-stack API, CMS with OAuth
- **Auto-detects your package manager** — bun, pnpm, yarn, or npm; detected one floated to top
- **Zero dependencies** — pure Node built-ins, works offline, no `npm install` needed
- **CI-friendly** — fully non-interactive with `--template`, `--pm`, `--no-install` flags

## Templates

| Template | Description |
|----------|-------------|
| `default` | Static page — heading, text, CSS design block |
| `counter` | Interactive counter with `@state` reactive variable |
| `blog` | Build-time posts with `@build` — zero JS shipped |
| `api` | Full-stack REST API with `@route`, db models, background job |
| `cms` | CMS with GitHub/Google OAuth, admin panel, `@live` data |

## Usage

```bash
# Interactive wizard
npx create-arc-web

# Name pre-filled, still prompts for template + pm
npx create-arc-web my-app

# Fully non-interactive (CI)
npx create-arc-web my-blog --template blog --no-install

# All flags
npx create-arc-web my-api --template api --pm bun --install
```

## Options

| Flag | Values | Default |
|------|--------|---------|
| `--template` | `default` \| `counter` \| `blog` \| `api` \| `cms` | interactive |
| `--pm` | `bun` \| `npm` \| `pnpm` \| `yarn` | auto-detected |
| `--install` | — | interactive |
| `--no-install` | — | interactive |
| `--version` / `-v` | — | print version |
| `--help` / `-h` | — | print help |

## Also available as `arc new`

```bash
npm i -g @arc-lang/arc
arc new
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
