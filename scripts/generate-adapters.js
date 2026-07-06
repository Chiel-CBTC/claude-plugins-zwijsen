#!/usr/bin/env node
// Sync core/<naam>/core.md naar claude-code/, copilot/ en chatgpt/.
// Nooit die mappen handmatig bewerken -- wijzigingen gaan verloren bij volgende run.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const coreDir = path.join(root, 'core');
const claudeSkillsDir = path.join(root, 'claude-code', 'skills');
const copilotDir = path.join(root, 'copilot');
const chatgptDir = path.join(root, 'chatgpt');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('core.md mist frontmatter (---\\nname: ...\\ndescription: ...\\n---)');
  }
  const [, fm, body] = match;
  const meta = {};
  for (const line of fm.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: body.trim() };
}

function generateFor(skillName) {
  const corePath = path.join(coreDir, skillName, 'core.md');
  const content = fs.readFileSync(corePath, 'utf8');
  const { meta, body } = parseFrontmatter(content);

  // Claude Code eist dit exacte pad: claude-code/skills/<naam>/SKILL.md
  const claudeSkillDir = path.join(claudeSkillsDir, skillName);
  fs.mkdirSync(claudeSkillDir, { recursive: true });
  fs.writeFileSync(
    path.join(claudeSkillDir, 'SKILL.md'),
    `---\nname: ${meta.name}\ndescription: ${meta.description}\n---\n\n${body}\n`
  );

  // Copilot reusable prompt file (handmatig kopieren naar .github/prompts/ in doel-repo)
  fs.mkdirSync(copilotDir, { recursive: true });
  fs.writeFileSync(
    path.join(copilotDir, `${meta.name}.prompt.md`),
    `<!-- ${meta.description} -->\n\n${body}\n`
  );

  // ChatGPT: plak in Custom GPT instructions of los uploaden
  fs.mkdirSync(chatgptDir, { recursive: true });
  fs.writeFileSync(path.join(chatgptDir, `${meta.name}-instructions.md`), `${body}\n`);

  console.log(`gesynced: ${skillName}`);
}

const skillNames = fs
  .readdirSync(coreDir)
  .filter((name) => fs.statSync(path.join(coreDir, name)).isDirectory());

for (const name of skillNames) {
  generateFor(name);
}
