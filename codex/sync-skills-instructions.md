# Skills syncen naar alle tool-mappen

## Wanneer

Na het toevoegen of wijzigen van een `core/<naam>/core.md` bestand in deze repo, voordat je commit/pusht.

## Stappen

1. Ga naar de root van deze repo (waar `scripts/generate-adapters.js` staat).
2. Run `node scripts/generate-adapters.js`.
3. Bekijk de diff (`git status` / `git diff`) — controleer of alleen `claude-code/`, `copilot/` en `codex/` zijn gewijzigd, nooit `core/` zelf.
4. Commit alle wijzigingen samen (core.md + gegenereerde output in 1 commit).
5. Push.

## Belangrijk

- Bewerk nooit bestanden in `claude-code/`, `copilot/` of `codex/` direct — die worden overschreven bij de volgende sync.
- Elke nieuwe skill heeft minimaal `core/<naam>/core.md` nodig met frontmatter (`name`, `description`) — zonder geldige frontmatter faalt het script met een duidelijke foutmelding.
