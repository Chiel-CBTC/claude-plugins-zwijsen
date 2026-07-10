---
name: ado-list-pbis
description: >
  Gebruik deze skill wanneer de gebruiker een lijst of overzicht wil van PBI's,
  werkitems of user stories in Azure DevOps, gefilterd op Area Path, status,
  team of type. Triggers: "geef me een lijstje met PBI's", "welke werkitems
  staan er in...", "toon de PBI's van team...", "wat staat er in de backlog
  voor...", of vergelijkbare verzoeken om een overzicht van bestaande werkitems.
---

# Azure DevOps werkitems opvragen

## Project

Standaard `Zwitch` — geef dit altijd expliciet mee als `project`-parameter bij de tool-call, zodat de tool niet zelf om een projectkeuze vraagt. Nooit navragen, tenzij de gebruiker expliciet een ander project noemt.

## Variabele filters (navragen indien niet expliciet gegeven)

- **Area Path** — bv. `Zwitch\Team Leerkracht`, `Zwitch\Team Leerling`, `Zwitch\Team Distributie en Toegang`
- **State** — bv. `New`, `Ready for refinement`, `In Progress`
- **WorkItemType** — default `Product Backlog Item`, tenzij anders gevraagd

## Werkwijze

1. Bouw een WIQL-query met de opgegeven filters (`wit_query_by_wiql`), gesorteerd op `System.ChangedDate` DESC tenzij anders gevraagd
2. Haal `System.Title` en `System.Tags` op voor de gevonden ID's via `wit_get_work_items_batch_by_ids`
3. Bij een sub-filter (bv. "alleen test-gerelateerde"): filter client-side op tags — bv. bevat `test automation`, of testsoort-tags (`E2E Test`, `Smoke Test`, `Chain Test`, `FE Integration Test`, `BE Integration Test`). Geen nieuwe WIQL-query nodig, hergebruik de al opgehaalde data.

## Standaard output-formaat

- Tabel met kolommen **ID** en **Titel**
- Titel is een klikbare markdown-link naar de PBI: `https://dev.azure.com/zwijsenonline/{projectGuid}/_workitems/edit/{id}` (projectGuid voor Zwitch: `538f95b0-4b81-42f5-abe0-b6f470d61edc`, anders ophalen via de work item respons)
- **Geen tags-kolom** tenzij de gebruiker daar expliciet om vraagt
- Geen extra duiding of samenvatting boven de tabel — de tabel is het antwoord

## Verwante skills

Voor het **aanmaken** van een PBI: zie `ado-create-pbi`. Voor het **wijzigen**: zie `ado-update-pbi`. Voor het **aanmaken van een bug**: zie `ado-create-bug`.
