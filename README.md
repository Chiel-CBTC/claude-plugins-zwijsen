# claude-plugins-zwijsen

Gedeelde skills/prompts voor AI-coding-tools binnen Zwijsen — werkt met Claude Code, GitHub Copilot en ChatGPT.

## Structuur

```
core/<naam>/core.md          <- bron van waarheid, hier bewerk je
claude-code/skills/<naam>/SKILL.md      <- gegenereerd, Claude Code plugin-pad
copilot/<naam>.prompt.md                <- gegenereerd, Copilot reusable prompt
chatgpt/<naam>-instructions.md          <- gegenereerd, ChatGPT custom instructions
scripts/generate-adapters.js            <- sync-script: core/ -> de drie mappen
```

`core/<naam>/core.md` bevat platte, tool-onafhankelijke instructies (frontmatter met `name` + `description`, daarna doel/stappen/voorbeeld). `node scripts/generate-adapters.js` synct dat naar de drie tool-mappen.

**Nooit `claude-code/`, `copilot/` of `chatgpt/` handmatig bewerken** — wijzigingen gaan verloren bij de volgende sync-run. Altijd via `core/<naam>/core.md`.

## Gebruik als Claude Code plugin

```
/plugin marketplace add Chiel-CBTC/claude-plugins-zwijsen
/plugin install claude-plugins-zwijsen@claude-plugins-zwijsen
```

Skills zijn dan beschikbaar als `/claude-plugins-zwijsen:<skill-naam>`. De plugin wordt geladen uit de submap `claude-code/` via `git-subdir` in `.claude-plugin/marketplace.json`.

## Gebruik in Copilot

Kopieer `copilot/<naam>.prompt.md` naar `.github/prompts/` in het doel-repo. Aanroepen met `/<naam>` in Copilot Chat.

## Gebruik in ChatGPT

Plak inhoud van `chatgpt/<naam>-instructions.md` in de Custom GPT instructions, of upload los als knowledge-bestand.

## Nieuwe skill toevoegen

1. Maak `core/<naam>/core.md` aan (zie `core/commit-message/core.md` als voorbeeld)
2. Run `node scripts/generate-adapters.js`
3. Commit alles (`core/`, `claude-code/`, `copilot/`, `chatgpt/`)

## Vereisten

Node.js (voor het generate-script), verder geen dependencies.
