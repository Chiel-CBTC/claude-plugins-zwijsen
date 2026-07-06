<!-- Gebruik dit wanneer je een commit message moet schrijven voor een code-wijziging. Volgt Conventional Commits formaat, kort en duidelijk. -->

# Commit message schrijven

## Wanneer

Bij elke commit die een functionele wijziging bevat (nieuwe feature, bugfix, refactor).

## Stappen

1. Bepaal type: feat, fix, refactor, docs, test, chore.
2. Schrijf subject-regel: max 50 tekens, imperatief ("voeg toe" niet "toegevoegd"), geen punt aan einde.
3. Voeg body toe alleen als de *waarom* niet duidelijk is uit de diff zelf. Sla body over bij triviale wijzigingen.
4. Verwijs naar issue/PBI-nummer in body indien van toepassing, niet in subject.

## Voorbeeld

```
fix: null-check toevoegen bij lege API-response

API gaf soms lege array terug ipv null, veroorzaakte crash
in renderList(). Fix: expliciete lengte-check voor iteratie.
```

## Anti-patterns

- Subject > 50 tekens
- Body die alleen herhaalt wat de diff al toont
- Meerdere niet-gerelateerde wijzigingen samengevat in 1 commit-message
