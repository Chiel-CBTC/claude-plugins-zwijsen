# Skills syncen naar alle tool-mappen

## Wanneer

Na het toevoegen of wijzigen van een `core/<naam>/core.md` bestand in deze repo, voordat je commit/pusht.

## Stappen

1. Bij een **nieuwe of gewijzigde** skill: vraag de gebruiker expliciet of de Claude Code-variant automatisch mag triggeren op basis van de `description`, of alleen handmatig aanroepbaar moet zijn (`/pluginnaam:skillnaam`).
   - Automatisch (default, geen extra veld): oké als de `description` smal en specifiek is (bv. noemt deze repo/context expliciet), zodat 'ie niet per ongeluk elders/op verkeerd moment triggert.
   - Handmatig (`disable-model-invocation: true` toevoegen aan frontmatter): oké als de `description` breed/generiek is en dus overal zou kunnen matchen.
2. Ga naar de root van deze repo (waar `scripts/generate-adapters.js` staat).
3. Run `node scripts/generate-adapters.js`.
4. Bekijk de diff (`git status` / `git diff`) — controleer of alleen `claude-code/`, `copilot/` en `codex/` zijn gewijzigd, nooit `core/` zelf.
5. Commit alle wijzigingen samen (core.md + gegenereerde output in 1 commit).
6. Push.

## Belangrijk

- Bewerk nooit bestanden in `claude-code/`, `copilot/` of `codex/` direct — die worden overschreven bij de volgende sync.
- Elke nieuwe skill heeft minimaal `core/<naam>/core.md` nodig met frontmatter (`name`, `description`) — zonder geldige frontmatter faalt het script met een duidelijke foutmelding.
- Extra frontmatter-velden (zoals `disable-model-invocation`) worden 1-op-1 doorgezet naar `SKILL.md` — alleen relevant voor de Claude Code-variant, Copilot/Codex-output negeert dit.
