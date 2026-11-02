#!/usr/bin/env node
// adhd-ally hook for Claude Code. One script handles two events:
//   SessionStart     -> loads the skill rules as context, so the mode is always on
//   UserPromptSubmit -> handles "/adhd-ally", "/adhd-ally off" and "stop adhd-ally",
//                       and adds a short reminder each turn so long sessions do not drift
const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL = path.join(__dirname, '..', 'skills', 'adhd-ally', 'SKILL.md');
const OFF = 'ADHD-ALLY OFF. Write normally until the user runs /adhd-ally again.';
const REMINDER = 'ADHD-ALLY ACTIVE. Answer first. One idea per message. Short chunks, plain words. ' +
  'First reply on a topic: about 6 lines, one example OR one analogy (never both), no extra terms or warnings yet. ' +
  'End with a one-line recap and one next step. If the user is confused, move down the confusion ladder ' +
  'and never repeat the last explanation.';

// ponytail: one global flag file, so all open sessions share on/off. Key it by session_id if that becomes a problem.
function flagPath() {
  return path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude'), '.adhd-ally-mode');
}
function isOn() {
  try { return fs.readFileSync(flagPath(), 'utf8').trim() === 'on'; } catch { return false; }
}
function setOn(on) {
  try { fs.writeFileSync(flagPath(), on ? 'on' : 'off'); } catch { /* best effort, never block the prompt */ }
}

function rules() {
  const body = fs.readFileSync(SKILL, 'utf8').replace(/^---[\s\S]*?---\s*/, '');
  return 'ADHD-ALLY MODE ACTIVE\n\n' + body;
}

// Returns the context text to inject, or '' for nothing.
function handle(event, prompt) {
  if (event === 'SessionStart') {
    const on = (process.env.ADHD_ALLY_DEFAULT || 'on').trim().toLowerCase() !== 'off';
    setOn(on);
    return on ? rules() : '';
  }
  if (event !== 'UserPromptSubmit') return '';

  const text = String(prompt || '').trim().toLowerCase().replace(/[.!?\s]+$/, '');
  const cmd = text.match(/^\/(?:adhd-ally:)?adhd-ally(?:\s+(\S+))?$/);
  if (text === 'stop adhd-ally' || text === 'normal mode' || (cmd && cmd[1] === 'off')) {
    setOn(false);
    return OFF;
  }
  if (cmd) {
    setOn(true);
    return rules();
  }
  return isOn() ? REMINDER : '';
}

if (require.main === module) {
  let input = '';
  process.stdin.on('data', (chunk) => { input += chunk; });
  process.stdin.on('end', () => {
    try {
      const data = JSON.parse(input.replace(/^﻿/, '') || '{}');
      const event = data.hook_event_name;
      const context = handle(event, data.prompt);
      if (context) {
        process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: context } }));
      }
    } catch { /* a broken hook must never block the user's prompt */ }
  });
} else {
  module.exports = { handle };
}
