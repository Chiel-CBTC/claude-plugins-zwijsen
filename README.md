# claude-plugins-zwijsen

Gedeelde skills/prompts voor AI-coding-tools binnen Zwijsen — werkt met Claude Code, GitHub Copilot en ChatGPT.

## Hoe het werkt

Elke skill heeft één bron van waarheid: `skills/<naam>/core.md`. Dat bestand bevat platte, tool-onafhankelijke instructies (frontmatter met `name` + `description`, daarna doel/stappen/voorbeeld).

Een generate-script zet dat om naar drie kant-en-klare varianten, allemaal naast core.md in dezelfde skill-map:

- `skills/<naam>/SKILL.md` — Claude Code plugin-pad (verplicht exact hier), werkt direct na installatie
- `skills/<naam>/<naam>.prompt.md` — Copilot reusable prompt, kopieer naar `.github/prompts/` in het doel-repo, aanroepen met `/<naam>` in Copilot Chat
- `skills/<naam>/chatgpt-instructions.md` — plak in Custom GPT instructions of los uploaden

## Gebruik als Claude Code plugin

```
/plugin marketplace add Chiel-CBTC/claude-plugins-zwijsen
/plugin install claude-plugins-zwijsen@claude-plugins-zwijsen
```

Skills zijn dan beschikbaar als `/claude-plugins-zwijsen:<skill-naam>`. Update door de marketplace opnieuw te syncen (`/plugin marketplace add` nogmaals, of via het plugin-menu).

## Nieuwe skill toevoegen

1. Maak `skills/<naam>/core.md` aan (zie `skills/commit-message/core.md` als voorbeeld)
2. Run `node scripts/generate-adapters.js`
3. Commit alles (core.md + gegenereerde bestanden)

**Nooit de gegenereerde bestanden handmatig bewerken** — wijzigingen gaan verloren bij de volgende generate-run. Altijd via `core.md`.

## Vereisten

Node.js (voor het generate-script), verder geen dependencies.
