# Phase 1 — Modèles et validations métier

Statut : spécification issue de la tranche verticale ; implémentation non commencée et gate non validée.

Source : [tranche-verticale.md — Phase 1 — Données et validations métier](../../../tranche-verticale.md). Lire également le [design-doc](../../../design-doc.md) et les [consignes applicables](../../../AGENTS.md).

### Objectif

Définir les données et les règles nécessaires au parcours, indépendamment d’Angular, de l’affichage et du stockage.

### Périmètre

- Prévoir les types du profil et de l’entretien limités aux informations de cette tranche, avec une identité permettant de distinguer les entretiens indépendants.
- Prévoir des fonctions pures de validation, sans modification des entrées et sans accès au DOM, au stockage ou au réseau.
- Contrôler les quatre champs obligatoires de l’entretien et les notes renseignées : uniquement des entiers de 0 à 10. Conserver la distinction entre absence de note et zéro.
- Prévoir le caractère facultatif des notes et du feeling, et les valeurs de feeling du design-doc.
- Préserver l’indépendance des entretiens et l’absence d’effet du profil ou du feeling sur les notes. Ne pas ajouter de condition de profil préalable.

### Livrables

Les types métier, les fonctions pures de validation et leurs tests unitaires ciblés avec des données fictives. Les choix de représentation seront documentés dans le plan d’implémentation de cette phase, sans ajouter de règles de profil absentes du design-doc.

### Jalon de fin et gate vers la phase 2

- **Vérification prévue :** exécuter avec `pnpm test` les tests couvrant les champs obligatoires, les notes valides et invalides, l’absence distincte de zéro et l’indépendance des données. Vérifier que ces tests métier ne nécessitent ni DOM, ni stockage, ni TestBed.
- **Résultat attendu :** les règles sont couvertes par des tests réussis ; aucune donnée invalide n’est acceptée selon ces règles, et aucune note n’est calculée ou modifiée implicitement.
- **Preuve nécessaire :** résultats des tests et correspondance entre les règles ci-dessus et les scénarios testés, accompagnés d’une revue de l’absence d’effets de bord. Tout échec bloque le passage à la phase 2.

## Documents de travail

- [Plan d'implémentation](plan-implementation.md).
- [Validation et preuves](validation.md).
