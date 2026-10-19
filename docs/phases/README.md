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
| 3 — Parcours Angular | [spec.md](03-interface-angular/spec.md) | [plan-implementation.md](03-interface-angular/plan-implementation.md) | [validation.md](03-interface-angular/validation.md) | Implémentée ; gate locale validée le 19 octobre 2026 |
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

## Mise à jour documentaire du 19 octobre 2026

Cette section conserve la revue documentaire antérieure à l'implémentation ; l'état actuel est donné dans la section de phase 3 ci-dessous.

L'historique Git est présent et les [consignes du dépôt](../../AGENTS.md#suivi-des-interventions-par-phase-et-par-issue-github) n'affirment plus qu'aucun commit n'existe. La mention obsolète de cet index est retirée. La [conclusion de phase 3](03-interface-angular/validation.md#conclusion) reconnaît désormais les gates locales documentées des phases 1 et 2, tout en maintenant sa propre gate non validée : plan détaillé non préparé et non approuvé, implémentation et vérifications du parcours non réalisées.

Les résultats du 18 octobre restent des preuves historiques locales. Cette correction documentaire ne les remplace pas et ne vaut pas recette navigateur.

### Vérification des critères de l'issue #2

L'[issue #2](https://github.com/GARNIER-Emmanuel/dyma-claude/issues/2) et ses commentaires ont été lus via le MCP GitHub de l'application ; aucun commentaire n'était présent. Les critères ci-dessous ont été vérifiés dans l'état local des [consignes du dépôt](../../AGENTS.md).

| Critère | Preuve documentaire | Résultat local |
|---|---|---|
| Règle dans l'AGENTS.md racine avec renvois aux phases | Section « Suivi des interventions par phase et par issue GitHub », règle 1 et lien vers cet index | Réussi |
| Règles métier non dupliquées | Règle 4 : renvois au design-doc, à la tranche verticale et aux spécifications | Réussi |
| Conduite en cas de contradiction | Règle 2 : faits et fichiers à signaler, arbitrage si nécessaire, suspension limitée au travail dépendant | Réussi |
| Preuves distinctes | Règle 5 : tests, compilation et observations navigateur séparés, contrôles non exécutés non vérifiés | Réussi |
| Exemple de phase 3 sans implémentation | Section « Exemple : préparer une intervention de phase 3 » et revue documentaire dans sa validation | Réussi |

Contrôles documentaires : revue du diff et `git diff --check` réussis ; les cibles des liens locaux des trois documents modifiés existent. L'environnement et l'état Git sont consignés dans la [revue documentaire](03-interface-angular/validation.md#revue-documentaire-du-19-octobre-2026--issue-2). Aucun test applicatif, compilation ou parcours navigateur n'a été exécuté pour cette modification de documentation.

Le compte rendu à publier pourra reprendre ces cinq résultats, les trois fichiers corrigés et les limites de vérification. Aucun commentaire, commit, push ou clôture n'a été effectué dans cette intervention ; la publication de ces changements sur GitHub reste non vérifiée.

## Phase 3 implémentée le 19 octobre 2026 — issue #3

Le plan détaillé a été approuvé par le message utilisateur « commit les docs (pas le nouveau skill) puis tu peux implémenter ». Les quatre documents en attente ont été committés dans `f75cb31`, à l'exclusion du skill. L'implémentation suivante reste locale et non commitée sur `codex/phase-3-interface-angular`.

Le parcours profil → création d'entretien sans profil préalable → liste/détail est utilisable, avec erreurs de validation et de stockage visibles. Les 319 tests, la compilation, les types et 13 scénarios navigateur sont réussis. La [validation](03-interface-angular/validation.md) distingue les commandes, les observations sur PC et les viewports mobiles émulés, et les [preuves](03-interface-angular/preuves/recette-navigateur.md).

La gate locale de phase 3 est validée. Le plan de phase 4 reste à préparer et à approuver ; la fermeture complète/réouverture et l'inspection réseau finale ne sont pas couvertes par cette validation. Aucun push, commentaire ou changement de l'issue GitHub n'a été effectué.
