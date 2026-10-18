# Phase 2 — plan d'implémentation à préparer

Statut : **cadrage documentaire uniquement ; plan détaillé non préparé et non approuvé**. Ce fichier réserve le support de travail de la phase et n'autorise aucune exécution.

Références : [spécification](spec.md), [tranche verticale](../../../tranche-verticale.md) et [consignes du dépôt](../../../AGENTS.md).

## Dépendance

La gate de phase 1 doit être validée. Les modèles, représentations de notes et validations réellement implémentés seront relus avant de fixer les contrats de stockage.

## Points à préciser dans le futur plan

- Un service Angular unique pour tous les accès à localStorage.
- La clé JobView et le format versionné du profil et des entretiens, sans inventer de migration.
- Les états de lecture : vide, valide, illisible ou inexploitable, version inconnue et accès refusé.
- Les signatures de lecture et sauvegarde, avec résultats explicites de réussite ou d'échec.
- La conservation du profil lors de l'ajout d'un entretien, et celle des entretiens lors de la sauvegarde du profil.
- Le refus de toute écriture de remplacement après une lecture non sûre.
- Les erreurs d'écriture, l'accès refusé et le stockage saturé.
- Les tests avec stockage simulé, les fichiers concernés et les critères de gate.

## Fichiers concernés à déterminer

Le service et ses tests seront placés dans `src/app/`, conformément aux consignes. Les noms, signatures et éventuels types seront arrêtés après inspection de la phase 1 ; aucun nom de fichier source n'est figé ici.

## Hors périmètre

Interface utilisateur, suppression automatique, remise à zéro, migration, récupération, réseau et fonctionnalités reportées.

## Validation à préparer

`pnpm test` et `pnpm build`, avec assertions de conservation des données et de l'absence d'écriture après lecture non sûre. Consigner les résultats dans [validation.md](validation.md).
