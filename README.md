# create-arc-web

Zero-dependency project scaffolder for [Arc](https://arc-lang.dev). Interactive wizard with arrow-key menus, 5 built-in templates, and auto-detected package manager.

```bash
npx create-arc-web
```

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

## Also available as `arc new`

```bash
npm i -g @arc-lang/arc
arc new
```

## License

MIT
