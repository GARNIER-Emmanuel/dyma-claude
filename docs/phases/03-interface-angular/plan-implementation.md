# Phase 3 — plan d'implémentation à préparer

Statut : **cadrage documentaire uniquement ; plan détaillé non préparé et non approuvé**. Ce fichier réserve le support de travail de la phase et n'autorise aucune exécution.

Références : [spécification](spec.md), [tranche verticale](../../../tranche-verticale.md) et [consignes du dépôt](../../../AGENTS.md).

## Dépendance

Les gates de phases 1 et 2 doivent être validées. Le plan utilisera les modèles, validations et contrats de stockage effectivement disponibles.

## Points à préciser dans le futur plan

- Navigation entre Mon profil et Mes entretiens.
- Formulaire de profil et formulaire de création d'entretien, sans profil préalable obligatoire.
- Quatre champs obligatoires, notes et feeling facultatifs, erreurs de saisie en français.
- Liste simple, état vide et consultation du détail.
- Affichage Non noté distinct de la note 0.
- Connexion aux fonctions métier et au service unique de stockage.
- Erreurs de lecture et de sauvegarde ; indisponibilité d'enregistrement en cas de stockage non sûr.
- Confirmation uniquement après écriture réussie ; conservation de la saisie après échec.
- Petits composants, accessibilité clavier, présentation mobile/PC et saisies affichées comme du texte.
- Tests Angular TestBed et conservation du test de démarrage.

## Fichiers concernés à déterminer

Inspecter les composants actuels de `src/app/` et les fichiers des phases 1 et 2. Proposer ensuite la liste des composants, tests, templates et styles concernés, sans fixer ici d'architecture ou ajouter une dépendance.

## Hors périmètre

Tris, filtres, recherche, modification, suppression, effacement global, champs d'entretien reportés et déploiement Vercel.

## Validation à préparer

`pnpm test`, `pnpm build` et parcours navigateur avec `pnpm dev`, sur mobile et PC. Documenter les états vides, erreurs, notes absentes/zéro et l'ordre entre écriture réussie et confirmation dans [validation.md](validation.md).
