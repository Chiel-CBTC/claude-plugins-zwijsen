---
name: pbi-start-branch
description: >
  Gebruik deze skill wanneer de gebruiker aangeeft aan een PBI/werkitem te
  willen beginnen, door een PBI-nummer of ADO-link te noemen in die context.
  Triggers: "pak PBI 84420 op", "laten we beginnen aan werkitem 12345", "ik ga
  aan de slag met PBI X", "start met item X", of vergelijkbare verzoeken om
  werk aan een specifiek werkitem op te starten. Niet gebruiken als de
  gebruiker alleen een PBI wil aanmaken, wijzigen of opvragen (zie
  `ado-create-pbi`, `ado-update-pbi`, `ado-list-pbis`) — deze skill gaat over
  de branch die erbij hoort.
---

# Branch starten voor een PBI

## Werkwijze — in deze volgorde

1. **PBI ophalen** — `wit_get_work_item` met project `Zwitch` (zie `reference_ado_project`), voor `System.Title`, `System.WorkItemType`, `System.Tags` en eventueel `System.Description`.
2. **Altijd eerst vragen of er een nieuwe branch moet komen.** Nooit aannemen — de gebruiker pakt soms meerdere PBI's binnen dezelfde branch op. Bij "nee" of "hoeft niet": stop, geen verdere actie.
3. **Bij "ja": prefix bepalen.**
   - `test/` — als het PBI over Playwright-testscripts gaat (e2e-testen, integratietesten, ketentesten). Signaal hiervoor: `System.Tags` bevat `E2E Test`, `Smoke Test`, `Chain Test`, `FE Integration Test`, `BE Integration Test` of `test automation` (zie ook `ado-list-pbis`), of titel/omschrijving noemt expliciet Playwright/e2e/integratietest/ketentest. Bij twijfel: navragen i.p.v. gokken.
   - `bugfix/` — als `System.WorkItemType` = `Bug` en niet test-gerelateerd volgens bovenstaand signaal.
   - `feature/` — in alle overige gevallen.
4. **Naam opbouwen**: `<prefix><PBI-nummer>-<Titel-In-Hyphen-Case>`. Titel-woorden behouden hun hoofdletters (Title Case), gescheiden door hyphens, speciale tekens eruit. Voorbeeld: PBI 83386 "EVA Automatische Testen: Automatiseren Voortgang door de drempels" → `feature/83386-EVA-Automatische-Testen-Automatiseren-Voortgang-door-de-drempels`. Bij een erg lange titel: inkorten tot de kern, PBI-nummer blijft altijd voorop staan.
5. **Voorstel tonen, expliciet op akkoord wachten.** Een verduidelijkende reactie ("ja maar dan wel..." / een vraag terug) is geen goedkeuring — pas doorgaan na een echte bevestiging.
6. **Bij akkoord, uitvoeren:**
   ```bash
   git status              # uncommitted changes? Melden aan gebruiker, niet zomaar overschrijven/stashen
   git fetch origin master
   git branch --no-track <branch-naam> origin/master   # branch altijd afgeleid van de laatste master, niet een verouderde lokale
   git switch <branch-naam>
   ```
   `git branch ... origin/master` + `git switch` i.p.v. eerst lokale `master` te checken-uit-en-pullen: zo blijft de huidige werkbranch/working tree van de gebruiker ongemoeid tot het echte switch-moment.

   **`--no-track` is verplicht.** Zonder deze flag zet git (via `branch.autoSetupMerge`) de nieuwe branch automatisch op `origin/master` als upstream, omdat 'ie daarvandaan is afgeleid. Een latere `git push` probeert dan naar `master` te pushen i.p.v. een eigen remote-branch aan te maken, en faalt (of erger, raakt `master`). Bij het pushen van de branch hoort altijd `git push -u origin <branch-naam>` om de juiste upstream te zetten.
7. **Bevestigen**: branchnaam + dat je nu op die branch zit.

## Wat deze skill niet doet

Geen `git push` — de branch blijft lokaal totdat de gebruiker daar apart om vraagt. Geen automatische PBI-status-wijziging in ADO (bv. naar "In Progress") tenzij expliciet gevraagd.
