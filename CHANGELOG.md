# Changelog

## 0.1.0 — 2026-05-29

Initial release.

- Interactive wizard with arrow-key menus (pure Node built-ins, zero external dependencies)
- 5 templates: default, counter, blog, api, cms
- Auto-detects bun → pnpm → yarn → npm; detected PM floated to top of list
- Non-interactive mode: `npx create-arc-web my-app --template blog --no-install`
- `--pm`, `--template`, `--install` / `--no-install` flags
- Also available as `arc new` via the `@arc-lang/arc` CLI
