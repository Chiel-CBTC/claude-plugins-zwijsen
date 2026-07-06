# claude-plugins-zwijsen

Gedeelde skills/prompts voor AI-coding-tools binnen Zwijsen — werkt met Claude Code, GitHub Copilot en ChatGPT.

## Hoe het werkt

Elke skill heeft één bron van waarheid: `skills/<naam>/core.md`. Dat bestand bevat platte, tool-onafhankelijke instructies (frontmatter met `name` + `description`, daarna doel/stappen/voorbeeld).

Een generate-script zet dat om naar drie kant-en-klare varianten:

- `adapters/claude-code/SKILL.md` — met frontmatter, werkt direct als Claude Code skill
- `adapters/copilot/<naam>.prompt.md` — reusable prompt file, aanroepen met `/naam` in Copilot Chat
- `adapters/chatgpt/instructions.md` — plak in Custom GPT instructions of los uploaden

## Nieuwe skill toevoegen

1. Maak `skills/<naam>/core.md` aan (zie `skills/commit-message/core.md` als voorbeeld)
2. Run `node scripts/generate-adapters.js`
3. Commit alles (core.md + gegenereerde adapters)

**Nooit adapters handmatig bewerken** — wijzigingen gaan verloren bij de volgende generate-run. Altijd via `core.md`.

## Vereisten

Node.js (voor het generate-script), verder geen dependencies.
