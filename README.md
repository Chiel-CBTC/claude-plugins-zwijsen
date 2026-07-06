# claude-plugins-zwijsen

Gedeelde skills/prompts voor AI-coding-tools binnen Zwijsen — werkt met Claude Code, GitHub Copilot en Codex CLI.

**Scope: alleen skills die over meerdere app-repo's heen herbruikbaar zijn (global skills) horen hier.** App-specifieke skills horen lokaal in die ene app-repo (`.claude/skills/`, eigen `.github/prompts/`, eigen `AGENTS.md`), niet in deze gedeelde repo.

## Structuur

```
core/<naam>/core.md          <- bron van waarheid, hier bewerk je
claude-code/skills/<naam>/SKILL.md      <- gegenereerd, Claude Code plugin-pad
copilot/<naam>.prompt.md                <- gegenereerd, Copilot reusable prompt
codex/<naam>-instructions.md            <- gegenereerd, Codex CLI instructions
scripts/generate-adapters.js            <- sync-script: core/ -> de drie mappen
```

`core/<naam>/core.md` bevat platte, tool-onafhankelijke instructies (frontmatter met `name` + `description`, daarna doel/stappen/voorbeeld). `node scripts/generate-adapters.js` synct dat naar de drie tool-mappen.

**Nooit `claude-code/`, `copilot/` of `codex/` handmatig bewerken** — wijzigingen gaan verloren bij de volgende sync-run. Altijd via `core/<naam>/core.md`.

## Gebruik als Claude Code plugin

```
/plugin marketplace add Chiel-CBTC/claude-plugins-zwijsen
/plugin install claude-plugins-zwijsen@zwijsen-plugins
```

Skills zijn dan beschikbaar als `/claude-plugins-zwijsen:<skill-naam>`. De plugin wordt geladen uit de submap `claude-code/` via `git-subdir` in `.claude-plugin/marketplace.json`.

## Gebruik in Copilot

Kopieer `copilot/<naam>.prompt.md` naar `.github/prompts/` in het doel-repo. Aanroepen met `/<naam>` in Copilot Chat. Het bestand heeft echte YAML-frontmatter (`description:`) nodig — Copilot herkent geen HTML-comments. In oudere VS Code-versies moet de setting `chat.promptFiles` aan staan; in recentere versies is dit standaard actief.

## Gebruik in Codex CLI

Inhoud van `codex/<naam>-instructions.md` los meegeven, of samenvoegen in `AGENTS.md` van het doel-repo. Codex CLI leest `AGENTS.md` automatisch in bij elke sessie (vergelijkbaar met Claude Code's `CLAUDE.md`), hiërarchisch vanaf de project-root tot de working directory. Let op: gecombineerde instructiebestanden worden afgekapt boven 32 KiB (`project_doc_max_bytes`).

## Distributie naar app-repo's

- **Claude Code**: via de marketplace hierboven — vooral omdat `/plugin marketplace update` updates makkelijk maakt.
- **Copilot & Codex**: geen automatisering. App-repo's/developers pakken `copilot/<naam>.prompt.md` resp. `codex/<naam>-instructions.md` zelf uit deze repo, plaatsen ze zelf, en updaten handmatig bij wijzigingen. Bewuste keuze om simpel te starten — voor deze twee tools bestaat er sowieso geen manier om extern naar deze repo te verwijzen (Copilot's `chat.promptFilesLocations` ondersteunt geen extern pad), dus automatiseren zou hier geen distributieprobleem oplossen, alleen complexiteit toevoegen.

## Nieuwe skill toevoegen

1. Maak `core/<naam>/core.md` aan (zie `core/commit-message/core.md` als voorbeeld)
2. Run `node scripts/generate-adapters.js`
3. Commit alles (`core/`, `claude-code/`, `copilot/`, `codex/`)

## Vereisten

Node.js (voor het generate-script), verder geen dependencies.
