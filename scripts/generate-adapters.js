#!/usr/bin/env node
// Genereert tool-specifieke adapters uit skills/<naam>/core.md.
// Nooit adapters handmatig bewerken -- wijzigingen gaan verloren bij volgende run.

const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '..', 'skills');

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
  const skillDir = path.join(skillsDir, skillName);
  const corePath = path.join(skillDir, 'core.md');
  const content = fs.readFileSync(corePath, 'utf8');
  const { meta, body } = parseFrontmatter(content);

  // Claude Code eist dit exacte pad: skills/<naam>/SKILL.md
  fs.writeFileSync(
    path.join(skillDir, 'SKILL.md'),
    `---\nname: ${meta.name}\ndescription: ${meta.description}\n---\n\n${body}\n`
  );

  // Copilot reusable prompt file (handmatig kopieren naar .github/prompts/)
  fs.writeFileSync(
    path.join(skillDir, `${meta.name}.prompt.md`),
    `<!-- ${meta.description} -->\n\n${body}\n`
  );

  // ChatGPT: plak in Custom GPT instructions of los uploaden
  fs.writeFileSync(path.join(skillDir, 'chatgpt-instructions.md'), `${body}\n`);

  console.log(`gegenereerd: ${skillName}`);
}

const skillNames = fs
  .readdirSync(skillsDir)
  .filter((name) => fs.statSync(path.join(skillsDir, name)).isDirectory());

for (const name of skillNames) {
  generateFor(name);
}
