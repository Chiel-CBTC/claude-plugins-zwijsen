---
name: ado-update-pbi
description: >
  Gebruik deze skill wanneer een bestaand Product Backlog Item, user story of
  werkitem in Azure DevOps gewijzigd moet worden — description, acceptatiecriteria,
  tags, parent of andere velden aanpassen, of een link tussen werkitems toevoegen.
  Triggers: "wijzig de PBI", "pas de description aan", "voeg een link toe aan de
  PBI", "update het werkitem", "corrigeer het acceptatiecriterium", of wanneer een
  eerder aangemaakt of besproken PBI nu aangepast moet worden.
---

# Azure DevOps werkitem wijzigen

## Project

Standaard `Zwitch` — geef dit altijd expliciet mee als `project`-parameter bij elke ADO-tool-call (`wit_get_work_item`, `wit_update_work_item`, etc.), zodat de tool niet zelf om een projectkeuze vraagt. Nooit navragen, tenzij de gebruiker expliciet een ander project noemt.

## Werkwijze — in deze volgorde, nooit overslaan

1. **Haal het werkitem altijd eerst opnieuw op** (`wit_get_work_item`, `expand: relations`) vóórdat je een veld overschrijft. Vertrouw nooit op een eerder in het gesprek onthouden versie van de tekst — die kan intussen handmatig gewijzigd zijn in ADO.
2. **Behoud het bestaande veldformaat.** Check `multilineFieldsFormat` in de opgehaalde data: `Html` of `Markdown`. Schrijf je update in hetzelfde formaat terug (`format` parameter bij `wit_update_work_item`), anders breekt de rendering.
3. **Wijzig gericht.** Neem de opgehaald tekst als basis en pas alleen aan wat gevraagd is — niet de hele description herformuleren als er maar één zin hoeft te veranderen.
4. **Toon kort wat er verandert** voordat je de update uitvoert, tenzij het om een triviale one-word-fix gaat.

## Parent en links

- Een parent-wijziging via het platte `System.Parent`-veld bij `wit_update_work_item` zet **geen** echte hiërarchie-link. Gebruik `wit_work_items_link` met `type: "parent"`.
- Voor een **topische** relatie tussen twee werkitems: `type: "related"`.
- Voor een **afhankelijkheid** (het ene werkitem moet eerst af zijn voor het andere): `type: "predecessor"` / `"successor"`, met een `comment` die het waarom benoemt. Dit drukt de volgorde zelf al uit — sterker dan een losse "Related"-link plus een zin in de tekst.
- Na een parent-link-wijziging: haal het werkitem opnieuw op en verifieer de AreaPath. ADO kan die automatisch overschrijven zodra je aan een parent in een ander team linkt.
- `wit_add_child_work_items` neemt AreaPath en IterationPath van de parent NIET automatisch over — de child valt terug op de root van het team project. Haal na aanmaak de parent's AreaPath/IterationPath op en zet die expliciet op de child via `wit_update_work_item`.

## Werkitems noemen in tekst

Noem je een ander werkitem (PBI/bug/task) in een comment, description, of ander veld — voeg dan altijd de volledige URL toe: `https://dev.azure.com/zwijsenonline/538f95b0-4b81-42f5-abe0-b6f470d61edc/_workitems/edit/{id}`. En leg de relatie ook daadwerkelijk vast via `wit_work_items_link` (meestal `"related"`) — een vermelding in tekst is geen vervanging voor een echte link.

## Personen taggen (@mention) in tekst

Wil de gebruiker iemand taggen in een comment/description ("tag Niels Snoeck", "zet hem als @mention") — gebruik altijd `@[Voornaam Achternaam]` als trigger-notatie in je eigen aantekeningen/uitleg, maar schrijf in het veld zelf de echte ADO-mention-markup:

```
<a href="#" data-vss-mention="version:2.0,{identity-GUID}">@Voornaam Achternaam</a>
```

Twee valkuilen, allebei al een keer misgegaan:

1. **Veldformaat moet `Html` zijn.** Staat het veld op `Markdown` (check `multilineFieldsFormat`), dan rendert de anchor niet als mention-chip maar als losse tekst/kapotte HTML. Zet in dezelfde `wit_update_work_item`-call ook een update op pad `/multilineFieldsFormat/{FieldName}` met waarde `Html`, én herschrijf de rest van de bestaande inhoud naar echte HTML-tags (`<p>`, `<ul><li>`, `<strong>`, `<code>`) — markdown-syntax (`**vet**`, `- lijst`) wordt na de formaatwissel niet meer geïnterpreteerd en verschijnt als letterlijke tekens.
2. **De identity-GUID moet je opzoeken, niet raden.** De ADO-identities/graph-REST-endpoints (`vssps.dev.azure.com/.../identities`, `.../graph/users`) geven met de opgeslagen git-PAT een 401 (onvoldoende scope). Werkende omweg: haal 'm uit een plek waar die persoon al ergens als identity-object voorkomt binnen scope die wél werkt, bv. `GET .../git/repositories/{repo}/pullrequests/{id}/reviewers` (zelfde auth als PR's aanmaken) — daar staat `id` en `uniqueName` per reviewer. Of check `AssignedTo`/`ChangedBy` op een werkitem waar die persoon al in voorkomt.

## Veelgemaakte fout

Een update-call bouwen op de eigen onthouden tekst uit het gesprek, zonder opnieuw op te halen. Als de gebruiker tussentijds handmatig iets in ADO heeft aangepast, overschrijft de volgende update dat stilletjes. Altijd `wit_get_work_item` vóór `wit_update_work_item`.

## Verwante skills

Voor het **aanmaken** van een nieuw PBI: zie `ado-create-pbi`. Voor het **aanmaken van een bug**: zie `ado-create-bug`. Voor een **overzicht/lijst** van PBI's: zie `ado-list-pbis`.
