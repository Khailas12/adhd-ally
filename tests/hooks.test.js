// Run: node --test tests/hooks.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

process.env.CLAUDE_CONFIG_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'adhd-ally-'));
const { handle } = require('../hooks/adhd-ally.js');

test('session start loads the rules without frontmatter', () => {
  delete process.env.ADHD_ALLY_DEFAULT;
  const out = handle('SessionStart');
  assert.match(out, /ADHD-ALLY MODE ACTIVE/);
  assert.match(out, /Confusion ladder/);
  assert.doesNotMatch(out, /^name: adhd-ally/m);
});

test('reminder, stop, and turn back on', () => {
  handle('SessionStart');
  assert.match(handle('UserPromptSubmit', 'what is an API?'), /ADHD-ALLY ACTIVE/);
  assert.match(handle('UserPromptSubmit', 'Stop adhd-ally!'), /OFF/);
  assert.strictEqual(handle('UserPromptSubmit', 'what is an API?'), '');
  assert.match(handle('UserPromptSubmit', '/adhd-ally'), /ADHD-ALLY MODE ACTIVE/);
  assert.match(handle('UserPromptSubmit', '/adhd-ally:adhd-ally off'), /OFF/);
  assert.match(handle('UserPromptSubmit', '/adhd-ally:adhd-ally'), /ADHD-ALLY MODE ACTIVE/);
});

test('ADHD_ALLY_DEFAULT=off skips activation', () => {
  process.env.ADHD_ALLY_DEFAULT = 'off';
  assert.strictEqual(handle('SessionStart'), '');
  assert.strictEqual(handle('UserPromptSubmit', 'hello'), '');
  delete process.env.ADHD_ALLY_DEFAULT;
});
