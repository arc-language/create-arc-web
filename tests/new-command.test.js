'use strict'

const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { execFileSync } = require('child_process')

const { validateName, detectAvailablePMs, getTemplate, newProject } = require('../src/new-command')

const TMPDIR = os.tmpdir()
const BIN = path.resolve(__dirname, '..', 'bin', 'create-arc-web.js')

function mkTmpDir(name) {
  return fs.mkdtempSync(path.join(TMPDIR, `caw-test-${name}-`))
}

function rmDir(dir) {
  try { fs.rmSync(dir, { recursive: true, force: true }) } catch {}
}

// ── validateName ─────────────────────────────────────────────────────────────

describe('validateName', () => {
  test('rejects null', () => {
    assert.ok(validateName(null) !== null)
  })

  test('rejects empty string', () => {
    assert.ok(validateName('') !== null)
  })

  test('rejects whitespace-only', () => {
    assert.ok(validateName('   ') !== null)
  })

  test('rejects name with spaces', () => {
    assert.ok(validateName('my app') !== null)
  })

  test('rejects leading dot', () => {
    assert.ok(validateName('.hidden') !== null)
  })

  test('rejects leading dash', () => {
    assert.ok(validateName('-bad') !== null)
  })

  test('rejects name that sanitizes to empty (all special chars)', () => {
    assert.ok(validateName('!!!') !== null)
  })

  test('rejects name longer than 214 characters', () => {
    assert.ok(validateName('a'.repeat(215)) !== null)
  })

  test('accepts valid lowercase name', () => {
    assert.equal(validateName('myapp'), null)
  })

  test('accepts mixed-case name (sanitizable)', () => {
    assert.equal(validateName('My_App!Name'), null)
  })

  test('accepts name exactly 214 characters', () => {
    assert.equal(validateName('a'.repeat(214)), null)
  })
})

// ── detectAvailablePMs ────────────────────────────────────────────────────────

describe('detectAvailablePMs', () => {
  test('returns a non-empty array of valid PM names', () => {
    const valid = new Set(['bun', 'npm', 'pnpm', 'yarn'])
    const result = detectAvailablePMs()
    assert.ok(Array.isArray(result), 'should return array')
    assert.ok(result.length > 0, 'should have at least one PM')
    for (const pm of result) {
      assert.ok(valid.has(pm), `"${pm}" is not a valid PM name`)
    }
  })

  test('probe order is bun → pnpm → yarn → npm', () => {
    const order = ['bun', 'pnpm', 'yarn', 'npm']
    const result = detectAvailablePMs()
    const indices = result.map(pm => order.indexOf(pm))
    for (let i = 1; i < indices.length; i++) {
      assert.ok(indices[i] > indices[i - 1], 'PMs should appear in probe order')
    }
  })

  test('result contains no duplicates', () => {
    const result = detectAvailablePMs()
    const unique = [...new Set(result)]
    assert.deepEqual(result, unique)
  })
})

// ── getTemplate ───────────────────────────────────────────────────────────────

describe('getTemplate', () => {
  test('default: has index.arc, package.json, .gitignore with correct pkg.name', () => {
    const files = getTemplate('my-project', 'default')
    assert.ok('index.arc' in files)
    assert.ok('package.json' in files)
    assert.ok('.gitignore' in files)
    const pkg = JSON.parse(files['package.json'])
    assert.equal(pkg.name, 'my-project')
  })

  test('counter: index.arc contains @state', () => {
    const files = getTemplate('ctr', 'counter')
    assert.ok(files['index.arc'].includes('@state let count'))
  })

  test('blog: index.arc contains @build', () => {
    const files = getTemplate('blog', 'blog')
    assert.ok(files['index.arc'].includes('@build const posts'))
  })

  test('api: has nested server files; pm=bun uses bun start script', () => {
    const files = getTemplate('my-api', 'api', 'bun')
    assert.ok('server/schemas/post.arc' in files)
    assert.ok('server/routes/posts.arc' in files)
    assert.ok('server/jobs/notify.arc' in files)
    const pkg = JSON.parse(files['package.json'])
    assert.equal(pkg.scripts.start, 'bun dist/server.js')
  })

  test('api: pm=npm uses node start script', () => {
    const files = getTemplate('my-api', 'api', 'npm')
    const pkg = JSON.parse(files['package.json'])
    assert.equal(pkg.scripts.start, 'node dist/server.js')
  })

  test('cms: has arc.config.json and .gitignore lists it', () => {
    const files = getTemplate('my-cms', 'cms', 'bun')
    assert.ok('arc.config.json' in files)
    assert.ok(files['.gitignore'].includes('arc.config.json'))
  })

  test('cms: pm=npm uses node start script', () => {
    const files = getTemplate('my-cms', 'cms', 'npm')
    const pkg = JSON.parse(files['package.json'])
    assert.equal(pkg.scripts.start, 'node dist/server.js')
  })

  test('name with special chars is sanitized in package.json', () => {
    const files = getTemplate('My_App!', 'default')
    const pkg = JSON.parse(files['package.json'])
    assert.ok(/^[a-z0-9-]+$/.test(pkg.name), `Expected valid npm name, got: ${pkg.name}`)
  })
})

// ── newProject ────────────────────────────────────────────────────────────────

describe('newProject', () => {
  test('creates api template with nested server/ directories', () => {
    const dir = mkTmpDir('api')
    try {
      const cwd = process.cwd()
      process.chdir(dir)
      try { newProject('my-api', 'api', { pm: 'npm' }) } finally { process.chdir(cwd) }
      assert.ok(fs.existsSync(path.join(dir, 'my-api', 'server', 'schemas', 'post.arc')))
      assert.ok(fs.existsSync(path.join(dir, 'my-api', 'server', 'routes', 'posts.arc')))
      assert.ok(fs.existsSync(path.join(dir, 'my-api', 'package.json')))
    } finally { rmDir(dir) }
  })

  test('creates cms template with arc.config.json in .gitignore', () => {
    const dir = mkTmpDir('cms')
    try {
      const cwd = process.cwd()
      process.chdir(dir)
      try { newProject('my-cms', 'cms', { pm: 'npm' }) } finally { process.chdir(cwd) }
      assert.ok(fs.existsSync(path.join(dir, 'my-cms', 'arc.config.json')))
      const gi = fs.readFileSync(path.join(dir, 'my-cms', '.gitignore'), 'utf8')
      assert.ok(gi.includes('arc.config.json'), '.gitignore should contain arc.config.json')
    } finally { rmDir(dir) }
  })

  test('throws when directory already exists and is not empty', () => {
    const dir = mkTmpDir('overwrite')
    const projDir = path.join(dir, 'occupied')
    try {
      fs.mkdirSync(projDir)
      fs.writeFileSync(path.join(projDir, 'keep.txt'), 'do not lose me')
      const cwd = process.cwd()
      process.chdir(dir)
      try {
        assert.throws(() => newProject('occupied'), /already exists/)
      } finally { process.chdir(cwd) }
      assert.ok(fs.existsSync(path.join(projDir, 'keep.txt')), 'existing file should be preserved')
    } finally { rmDir(dir) }
  })

  test('throws on empty name', () => {
    assert.throws(() => newProject(''), /cannot be empty/)
  })

  test('throws on name with spaces', () => {
    assert.throws(() => newProject('my app'), /cannot contain spaces/)
  })

  test('throws on unknown template', () => {
    assert.throws(() => newProject('test-proj', 'unknown'), /unknown template/i)
  })
})

// ── bin: create-arc-web ───────────────────────────────────────────────────────

describe('create-arc-web bin', () => {
  test('--help exits 0 and prints Usage', () => {
    const out = execFileSync('node', [BIN, '--help'], { encoding: 'utf8' })
    assert.ok(out.includes('Usage'), `Expected "Usage" in help output:\n${out}`)
  })

  test('--version exits 0 and prints semver', () => {
    const out = execFileSync('node', [BIN, '--version'], { encoding: 'utf8' }).trim()
    assert.ok(/^\d+\.\d+\.\d+/.test(out), `Expected semver, got: ${out}`)
  })

  test('non-interactive: --template blog --no-install creates blog project', () => {
    const dir = mkTmpDir('bin-blog')
    try {
      execFileSync('node', [BIN, 'test-blog', '--template', 'blog', '--no-install'], { cwd: dir, stdio: 'pipe' })
      const arc = fs.readFileSync(path.join(dir, 'test-blog', 'index.arc'), 'utf8')
      assert.ok(arc.includes('@build const posts'), `Expected @build in:\n${arc}`)
    } finally { rmDir(dir) }
  })

  test('unknown --template exits non-zero', () => {
    assert.throws(
      () => execFileSync('node', [BIN, 'x', '--template', 'nope', '--no-install'], { stdio: 'pipe' }),
      /Command failed/
    )
  })

  test('non-interactive: --template api --pm npm --no-install creates api project', () => {
    const dir = mkTmpDir('bin-api')
    try {
      execFileSync('node', [BIN, 'my-api', '--template', 'api', '--pm', 'npm', '--no-install'], { cwd: dir, stdio: 'pipe' })
      assert.ok(fs.existsSync(path.join(dir, 'my-api', 'server', 'routes', 'posts.arc')))
    } finally { rmDir(dir) }
  })
})
