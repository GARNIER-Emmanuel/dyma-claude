# JobView — documentation par phase

Cette arborescence organise les spécifications, les plans et les preuves par phase de la première tranche verticale. Elle remplace l'organisation par numéro de prompt comme point d'entrée de travail, sans déplacer ni supprimer les prompts d'origine.

## Documents de référence

- [Design-doc](../../design-doc.md) : périmètre et règles de la V1.
- [Tranche verticale](../../tranche-verticale.md) : parcours retenu, limites et gates successives.
- [Consignes du dépôt](../../AGENTS.md) et [consignes de l'application](../../src/app/AGENTS.md).
- [README du projet](../../README.md) : environnement et commandes.

Ces sources restent les références. Signaler tout désaccord avant de modifier une règle métier. Les spécifications par phase sont des extractions de la tranche verticale ; une évolution du périmètre devra être répercutée dans les documents concernés.

## Navigation

| Phase | Spécification | Plan | Vérifications et preuves | État actuel |
|---|---|---|---|---|
| 1 — Modèles et validations métier | [spec.md](01-modeles-validations-metier/spec.md) | [plan-implementation.md](01-modeles-validations-metier/plan-implementation.md) | [validation.md](01-modeles-validations-metier/validation.md) | Implémentée ; gate locale validée le 18 octobre 2026 |
| 2 — Persistance locale protégée | [spec.md](02-persistance-locale/spec.md) | [plan-implementation.md](02-persistance-locale/plan-implementation.md) | [validation.md](02-persistance-locale/validation.md) | Implémentée ; gate locale validée le 18 octobre 2026 |
| 3 — Parcours Angular | [spec.md](03-interface-angular/spec.md) | [plan-implementation.md](03-interface-angular/plan-implementation.md) | [validation.md](03-interface-angular/validation.md) | Plan détaillé à préparer après la phase précédente |
| 4 — Recette finale | [spec.md](04-recette-finale/spec.md) | [plan-implementation.md](04-recette-finale/plan-implementation.md) | [validation.md](04-recette-finale/validation.md) | Plan détaillé à préparer après la phase précédente |

## Rôle des fichiers

- `spec.md` : objectif, périmètre, livrables et gate issus de la tranche verticale.
- `plan-implementation.md` : choix techniques proposés, ambiguïtés, fichiers concernés, étapes et tests. Un plan rédigé ne vaut pas approbation.
- `validation.md` : contrôles à effectuer, résultats observés, preuves et conclusion de gate. Une case non cochée n'est pas une vérification réussie.

## Déroulement

1. Lire la spécification et les instructions applicables, puis inspecter le code réel.
2. Préparer ou actualiser le plan et signaler les décisions ouvertes.
3. Obtenir la validation du plan avant toute implémentation de la phase.
4. Implémenter uniquement le périmètre validé.
5. Effectuer les contrôles, consigner les résultats réels et revoir les changements.
6. Passer à la phase suivante uniquement si la gate est validée et son plan approuvé.

Pour chaque contrôle, distinguer **réussi**, **échoué** et **non vérifié**. Indiquer les anomalies, les fichiers concernés et leur gravité. Une vérification obligatoire absente ou échouée empêche de déclarer la gate validée.

## État au 18 octobre 2026

Les phases 1 et 2 sont implémentées : types et validations métier, puis service de persistance locale protégée avec format versionné et tests ciblés. Les preuves locales sont disponibles dans leurs dossiers. Les phases 3 et 4 restent à préparer et à implémenter.

L'interface affiche toujours « JobView ». Les 270 tests passent, ainsi que la compilation de production et la vérification TypeScript. Le service de persistance est disponible ; son raccordement à l'interface et la recette navigateur restent à réaliser dans les phases suivantes.

Le fichier `AGENTS.md` racine indique encore qu'aucun commit n'existe, alors qu'un historique Git est présent. Ce décalage documentaire est signalé ; sa correction ne fait pas partie de cet ajout.
