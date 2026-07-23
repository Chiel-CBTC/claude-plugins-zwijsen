# claude-plugins-zwijsen

Gedeelde Claude Code skills voor Zwijsen — Azure DevOps workflows.

**Scope: alleen skills die over meerdere app-repo's heen herbruikbaar zijn (global skills) horen hier.** App-specifieke skills horen lokaal in die ene app-repo (`.claude/skills/`), niet in deze gedeelde repo.

## Structuur

```
skills/<naam>/SKILL.md              <- bron van waarheid, hier bewerk je direct
.claude-plugin/marketplace.json     <- marketplace-definitie
.claude-plugin/plugin.json          <- plugin-definitie
```

Elke `SKILL.md` is meteen de enige en definitieve versie — geen generatie- of syncstap.

## Installeren

```bash
claude plugin marketplace add Chiel-CBTC/claude-plugins-zwijsen
claude plugin install claude-plugins-zwijsen@zwijsen-plugins
```

Skills zijn dan beschikbaar als `/claude-plugins-zwijsen:<skill-naam>`, en triggeren waar van toepassing ook automatisch op basis van hun `description`.

## Updaten

```bash
claude plugin marketplace update Chiel-CBTC/claude-plugins-zwijsen
```

## Nieuwe skill toevoegen

1. Maak `skills/<naam>/SKILL.md` aan met YAML-frontmatter (`name`, `description`) gevolgd door doel/stappen/voorbeeld.
2. Commit en push.

## Auto-trigger beheersen

Skills triggeren in Claude Code standaard automatisch obv. de `description` — risicovol bij een brede/generieke description die overal zou kunnen matchen. Frontmatter-veld `disable-model-invocation: true` zet dat uit: de skill is dan alleen nog handmatig aanroepbaar via `/claude-plugins-zwijsen:<skill-naam>`.

Vuistregel: smalle/context-specifieke description → automatisch laten; brede/generieke description → `disable-model-invocation: true`.

## Governance

Dit GitHub-repo is bewust een testbed voor het mechanisme. De uiteindelijke repo komt in Azure DevOps te staan, met verplichte PR + review voordat iets naar main mag.
