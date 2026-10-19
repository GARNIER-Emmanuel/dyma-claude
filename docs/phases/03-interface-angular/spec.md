# Phase 3 — Parcours Angular

Statut : spécification implémentée ; gate locale de phase 3 validée le 19 octobre 2026. Voir les résultats et limites dans [validation.md](validation.md). La phase 4 reste à planifier et à approuver.

Source : [tranche-verticale.md — Phase 3 — Parcours Angular de bout en bout](../../../tranche-verticale.md). Lire également le [design-doc](../../../design-doc.md) et les [consignes applicables](../../../AGENTS.md).

### Objectif

Rendre le parcours utilisable dans l’application, sur mobile et PC, en reliant l’interface aux règles et au service validés précédemment.

### Périmètre

- Prévoir l’accès aux espaces « Mon profil » et « Mes entretiens », le formulaire de profil et le formulaire de création d’entretien.
- Permettre la création d’un entretien sans profil enregistré. Présenter les champs obligatoires, les évaluations facultatives et les erreurs de saisie de manière compréhensible, en français.
- Afficher une liste simple, son état vide et la consultation des informations d’un entretien. Afficher « Non noté » lorsque la note est absente et conserver l’affichage de zéro lorsqu’elle vaut zéro.
- Charger les données via le service unique et afficher les erreurs de lecture ou de sauvegarde. En cas de stockage non sûr, rendre l’indisponibilité de l’enregistrement explicite sans proposer de remise à zéro automatique.
- Annoncer une sauvegarde et présenter des données comme enregistrées uniquement après une écriture réussie. En cas d’échec, conserver la saisie pour permettre sa correction ou une nouvelle tentative.
- Prévoir des formulaires et une navigation utilisables au clavier, sur petit écran et sur PC, avec accès au détail. Afficher les saisies comme du texte, sans interprétation HTML, et garder les données métier dans le navigateur.

### Livrables

Les composants et formulaires du parcours, la liste et le détail, leurs connexions aux validations et au stockage, les messages d’état et les tests d’interface ciblés avec Angular TestBed. Le test de démarrage existant reste couvert.

### Jalon de fin et gate vers la phase 4

- **Vérification prévue :** exécuter les tests d’interface avec `pnpm test`, compiler avec `pnpm build` et parcourir l’application démarrée avec `pnpm dev` sur mobile et PC. Couvrir les saisies invalides, zéro et l’absence de note, les erreurs de stockage, ainsi que l’ordre entre écriture réussie et message de confirmation.
- **Résultat attendu :** le profil peut être enregistré, un entretien peut être créé sans profil, puis retrouvé et consulté. Les erreurs sont visibles ; aucun échec n’est annoncé comme une réussite. Les informations essentielles et les actions restent accessibles aux deux tailles d’écran.
- **Preuve nécessaire :** résultats des tests et de compilation, relevé du parcours effectué dans le navigateur et captures des écrans essentiels, dont les états d’erreur et l’affichage mobile. Toute anomalie bloquante doit être corrigée avant la phase 4.

## Documents de travail

- [Plan d'implémentation](plan-implementation.md).
- [Validation et preuves](validation.md).
