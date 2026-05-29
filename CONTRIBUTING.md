# Contributing

## Local development

```bash
git clone https://github.com/arc-language/create-arc-web.git
cd create-arc-web
node --check bin/create-arc-web.js src/new-command.js src/colors.js
```

No install step needed — zero dependencies.

## Run tests

```bash
npm test
# or directly:
node --test 'tests/**/*.test.js'
```

## Try the CLI locally

```bash
node bin/create-arc-web.js            # interactive wizard
node bin/create-arc-web.js my-app --template blog --no-install
node bin/create-arc-web.js --help
node bin/create-arc-web.js --version
```

## Submitting changes

1. Fork the repo and create a branch from `master`
2. Add tests for any new behaviour
3. Make sure `npm test` passes
4. Open a pull request — CI will run automatically

## Adding a template

Templates live in `src/new-command.js` inside the `TEMPLATE_MAP` object in `getTemplate()`. Each template is a lazy factory: `() => ({ 'filename': 'content', ... })`. Add your template key to `VALID_TEMPLATES` at the top of the file and add a matching test in `tests/new-command.test.js`.
