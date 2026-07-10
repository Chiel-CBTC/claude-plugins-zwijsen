---
name: ado-create-bug
description: >
  Gebruik deze skill wanneer de gebruiker een bug wil aanmaken in Azure DevOps
  naar aanleiding van een gefaalde test, gerapporteerde fout of geconstateerd
  defect. Triggers: "maak een bug aan", "voer een bug op", "log dit als bug in
  ADO", "meld dit als bug", of wanneer een test-failure of gevonden probleem
  vastgelegd moet worden als werkitem. Zoek altijd eerst naar bestaande
  gerelateerde werkitems voordat je een nieuwe bug aanmaakt.
---

# Azure DevOps bug aanmaken

## Vaste waarden (altijd automatisch invullen)

| Veld      | Waarde                          |
|-----------|----------------------------------|
| Project   | Zwitch                          |
| Iteration | Zwitch (of huidige sprint indien bekend) |
| State     | New                              |
| Type      | Bug                               |

Project is standaard `Zwitch` — geef dit altijd expliciet mee als `project`-parameter bij de tool-call, zodat de tool niet zelf om een projectkeuze vraagt. Nooit navragen, tenzij de gebruiker expliciet een ander project noemt.

## Werkwijze — in deze volgorde, nooit overslaan

1. **Zoek eerst naar bestaande gerelateerde werkitems**, vóórdat je iets aanmaakt. Bouw een WIQL-query (`wit_query_by_wiql`) met `CONTAINS` op `System.Title` en `System.Description` voor de kernbegrippen uit het probleem (testnaam, foutmelding, betrokken component/scherm). Haal titels op via `wit_get_work_items_batch_by_ids` en filter handmatig op relevantie — brede trefwoorden zoals "cache" of een generieke foutcode leveren veel ruis op, dus lees de titels door voor je concludeert dat er niks bestaat.
   - Vind je een sterke match (bv. een eerder item met exact dezelfde testnaam of foutmelding): meld dit expliciet aan de gebruiker vóórdat je verdergaat, inclusief link. Een eerder gesloten, vergelijkbaar item is een signaal dat het probleem structureel is in plaats van incidenteel — vermeld dat.
2. **Vraag/verzamel de vereiste velden** (één voor één, niet gebundeld — wacht op antwoord voordat je de volgende stelt — tenzij al impliciet duidelijk uit het voorafgaande gesprek):
   - Area Path
   - Titel — houd 'm kort. Betreft de bug een test-suite: begin de titel met de test-soort als prefix (Unit Testen; FE Integration Testen; BE Integration Testen; Smoke Testen; E2E Testen; Ketentesten), gevolgd door " - " en een korte beschrijving van het probleem. Details (reproductiestappen, timing, condities) horen in ReproSteps, niet in de titel.
   - Reproductiestappen en bewijs (wat is precies waargenomen, hoe te reproduceren — repro-commando indien van toepassing)
   - Vermoedelijke oorzaak (indien bekend; anders expliciet "onbekend" laten staan i.p.v. te gokken)
   - Priority
   - Te linken werkitems (related / duplicate of / parent)
3. **Toon een korte samenvatting** van het voorgestelde bugreport ter bevestiging, voordat je 'm daadwerkelijk aanmaakt.
4. **Maak de bug aan** via `wit_create_work_item` met alle velden. Stuur relaties niet mee als plat veld (zet geen echte link) — koppel na aanmaken via `wit_work_items_link`.
   - Let op: het Bug-template vereist `Microsoft.VSTS.TCM.ReproSteps` én `Microsoft.VSTS.Common.AcceptanceCriteria` als verplichte, niet-lege velden. Zonder deze velden faalt `wit_create_work_item` met `TF401320: Required, InvalidEmpty`.
   - **Let op formaat:** deze velden staan in dit ADO-project op HTML (`multilineFieldsFormat: html`), niet Markdown. Markdown-syntax (`**bold**`, ```` ``` ````, `-` lijstjes) wordt dan **letterlijk** getoond i.p.v. gerenderd. Schrijf de content in HTML-tags (`<b>`, `<code>`, `<pre>`, `<br>`, `<ul><li>`) — zie Veldopbouw hieronder. Verifieer na aanmaken (stap 6) altijd visueel/via opgehaalde content of het goed rendert; zo niet, update met `wit_update_work_item` en HTML-tags.
   - `System.Description` niet gebruiken — wordt niet getoond op het Bug-formulier (zie Veldopbouw hieronder).
5. **Link de bug**:
   - `"related"` aan een gevonden verwant werkitem uit stap 1 (meest gangbaar)
   - `"duplicate of"` als het exact hetzelfde, nog openstaande probleem betreft
6. **Haal het aangemaakte item opnieuw op** (`wit_get_work_item`) en verifieer dat AreaPath, tags en links kloppen.
7. **Meld de gebruiker** het werkitem-ID en een klikbare link: `https://dev.azure.com/zwijsenonline/{projectGuid}/_workitems/edit/{id}` (projectGuid voor Zwitch: `538f95b0-4b81-42f5-abe0-b6f470d61edc`, anders ophalen via de work item respons).

## Veldopbouw

Onderstaande structuur weergegeven in Markdown voor leesbaarheid — in de daadwerkelijke API-call omzetten naar HTML-tags (zie formaat-opmerking in stap 4): `**x**` → `<b>x</b>`, `` `x` `` → `<code>x</code>`, code block → `<pre>...</pre>`, nieuwe regel → `<br>`.

**`Microsoft.VSTS.TCM.ReproSteps`** (verplicht):
```
**Scenario:**
Test: `[exacte testnaam]` — `[bestand:regelnummer]`
(evt. afhankelijkheid van andere test/volgorde vermelden)

[reproductiestappen / repro-commando]

**Verwacht resultaat:**
[wat er zou moeten gebeuren]

**Werkelijk resultaat:**
[wat er daadwerkelijk gebeurt — met bewijs: foutmelding, screenshot, log]

**Extra info:** (optioneel)
Vermoedelijke oorzaak: [hypothese, indien bekend, anders "onbekend"]

[overige aanvullende context — bv. eerdere vergelijkbare meldingen/gerelateerde items, omgeving, timing-observaties]
```

**`Microsoft.VSTS.Common.AcceptanceCriteria`** (verplicht):
```
[wat "opgelost" betekent — concreet, bv. welke test weer stabiel moet slagen]
```

**Niet gebruiken: `System.Description`.** Bij het Bug-werkitemtype in deze ADO-omgeving wordt dit veld niet getoond op het formulier — content erin is technisch opgeslagen maar voor de gebruiker onzichtbaar. Zet alles (incl. vermoedelijke oorzaak en gerelateerde werkitems) in **Extra info** binnen ReproSteps, dat veld is wél zichtbaar (was al verplicht bij aanmaken, dus gegarandeerd onderdeel van het formulier).

## Opmerkingen

- Maak nooit een bug aan zonder eerst te zoeken naar bestaande gerelateerde items — voorkomt duplicaten én legt bloot of iets structureel is in plaats van een eenmalig incident.
- Title is verplicht; overige velden mogen leeg/onbekend zijn als de gebruiker dat aangeeft.
- Check `multilineFieldsFormat` bij gerelateerde items die je terugvindt (`Html` of `Markdown`) — puur ter oriëntatie, niet relevant voor het nieuwe item zelf tenzij je een bestaand item bijwerkt (zie `ado-update-pbi`).
- Noem je een ander (bestaand) werkitem ergens in tekst, bv. in "Extra info" van ReproSteps: voeg altijd de volledige URL toe (zie stap 7 voor het format) én leg de relatie ook echt vast via `wit_work_items_link` — een vermelding in tekst alleen is onvoldoende.

## Verwante skills

Voor het **aanmaken** van een PBI: zie `ado-create-pbi`. Voor het **wijzigen** van een bestaand werkitem: zie `ado-update-pbi`. Voor een **overzicht/lijst** van werkitems: zie `ado-list-pbis`.
