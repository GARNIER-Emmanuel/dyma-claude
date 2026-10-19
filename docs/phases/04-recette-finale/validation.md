# Phase 4 — validation et preuves

Statut : **plan approuvé le 19 octobre 2026 ; exécution autorisée après commit documentaire ; résultats finaux à recueillir**.

Références : [spécification](spec.md) et [plan](plan-implementation.md).

## Contrôles obligatoires

- [x] Les gates locales de phases 1 à 3 sont documentées comme validées ; validations et preuves relues.
- [x] Le plan détaillé de recette est explicitement approuvé avant exécution par « commit puis implemente ».
- [ ] Le profil et l'entretien sont retrouvés après fermeture complète et réouverture du navigateur à la même origine et dans le même profil.
- [ ] La création sans profil, la liste et la consultation sont vérifiées.
- [ ] L'absence de note, zéro et l'indépendance des évaluations sont vérifiés.
- [ ] La saisie invalide est refusée avec une erreur visible.
- [ ] Un échec de sauvegarde maîtrisé est observé sans perte de données ni fausse confirmation.
- [ ] Le parcours mobile et PC est vérifié avec les preuves nécessaires.
- [ ] L'inspection réseau pendant les scénarios ne révèle aucune transmission de données métier.
- [ ] L'adresse locale, le navigateur, le profil de navigation et l'environnement sont consignés.
- [ ] `pnpm test` réussit sur le code de la phase, avec une sortie conservée.
- [ ] `pnpm build` réussit sur le même état du code, avec une sortie conservée.
- [ ] La revue Git confirme le respect du périmètre, l'absence de fonctionnalités anticipées et de dépendances inutiles, et les tests des cas limites.

## Environnement et état du code

### Préparation du 19 octobre 2026 — issue #5

- Issue #5 ouverte et commentaires lus via le MCP GitHub : aucun commentaire. L'issue #4 supprimée a été écartée après confirmation de l'utilisateur.
- Départ : dépôt propre, branche `codex/phase-3-interface-angular`, HEAD `e66e4d9366a172796db01e99a92ce2b784dbd623`. Branche créée : `codex/phase-4-recette-finale`.
- Pendant la préparation, un changement externe à cette intervention a avancé HEAD à `7c78db41f14151b7ee4e6d14500e11aca714ecda` et établi le suivi de `origin/codex/phase-4-recette-finale`. Ce commit contient le plan en cours de préparation ainsi qu'une mise à jour de clôture de phase 3 ; changements préservés. Cela ne constitue pas une approbation du plan.
- Windows/PowerShell, Node.js **24.18.1** vérifié. `pnpm --version` échoue avant lancement (`EPERM` dans le cache Corepack utilisateur). Relance hors bac à sable impossible au démarrage de l'outil : `setup refresh had errors`. Version pnpm actuelle **non vérifiée** ; aucun test ou build final exécuté.
- Validations et preuves des phases [1](../01-modeles-validations-metier/validation.md), [2](../02-persistance-locale/validation.md) et [3](../03-interface-angular/validation.md) relues : gates locales validées les 18 et 19 octobre, 108, 270 et 319 tests réussis et compilations réussies. La phase 3 documente 13 scénarios Chromium. Ce sont des preuves historiques, pas une recette finale actuelle.
- Code et preuves de phase 3 présents dans `11c2724` ; aucun diff applicatif depuis ce commit jusqu'au HEAD de départ. Modèles, formulaires/templates, orchestration, service de stockage et pilote navigateur inspectés pour préparer les scénarios.
- Le plan fixe les données fictives, l'origine, les profils dédiés, tailles, panne simulée, fermeture complète et inspection réseau. **Approbation explicite en attente** ; aucune recette ni correction applicative effectuée.
- Contrôles documentaires réussis : `git diff --check`, revue des trois documents modifiés et vérification de leurs 36 liens locaux, toutes les cibles existantes. Aucun diff de `11c2724` à HEAD pour `src/`, `package.json`, `pnpm-lock.yaml` et `angular.json`. Ces contrôles ne valent ni tests applicatifs ni observations navigateur.

Lors de l'exécution : compléter date, état Git, versions effectives, commandes, navigateur, adresse, profils, tailles et preuves.

## Résultats

| Contrôle ou scénario | Résultat attendu | Résultat observé | Preuve | Statut |
|---|---|---|---|---|
| Prérequis phases 1 à 3 | Gates documentées et preuves disponibles | Validations et preuves historiques relues | Documents liés ci-dessus et historique Git | Réussi (revue documentaire) |
| Approbation du plan | Accord explicite avant recette | Message « commit puis implemente », après présentation du plan | Conversation du 19 octobre 2026 | Réussi |
| Version pnpm | 10.15.1 disponible | Démarrage empêché par Corepack ; relance impossible | Erreurs ci-dessus | Échoué (préparation technique) |
| Tests unitaires finaux | Réussite sur l'état final | Non exécutés | Aucune preuve de phase 4 | Non vérifié |
| Compilation finale | Réussite sur le même état des sources | Non exécutée | Aucune preuve de phase 4 | Non vérifié |
| S1 — Sans profil, liste/détail et notes | Création, zéro et absence distincts | Non exécuté | À recueillir après approbation | Non vérifié |
| S2 — Profil et indépendance | Profil sauvegardé, évaluations conservées | Non exécuté | À recueillir après approbation | Non vérifié |
| S3 — Saisies invalides | Erreurs visibles et stockage inchangé | Non exécuté | À recueillir après approbation | Non vérifié |
| S4 — Échec maîtrisé | Saisie et données conservées, aucun faux succès | Non exécuté | À recueillir après approbation | Non vérifié |
| S5 — Réouverture complète | Données exactes après arrêt/reprise du navigateur | Non exécuté | À recueillir après approbation | Non vérifié |
| S6 — PC, mobile émulé et clavier | Parcours utilisable, captures inspectées | Non exécuté | À recueillir après approbation | Non vérifié |
| S7 — Réseau | Aucune transmission métier observée | Non exécuté | À recueillir après approbation | Non vérifié |

Remplacer ou compléter ces lignes au fil des contrôles. Ne pas confondre un résultat attendu, une observation réelle et une preuve. Une vérification obligatoire absente reste non vérifiée et bloque la gate.

## Anomalies et revue

### Autorisation d'exécution du 19 octobre 2026

Le message utilisateur « commit puis implemente » approuve le plan détaillé et demande le commit documentaire avant son exécution. L'état « approbation en attente » de la préparation ci-dessus est historique. Les anomalies applicatives restent à présenter avant correction ; aucun push, commentaire ou clôture GitHub n'est demandé.

Aucune revue de code implémenté n'a été réalisée pour cette phase. Pour chaque anomalie constatée, indiquer la gravité, le fichier ou scénario concerné, le problème, la correction proposée et les contrôles à refaire. Ne pas annoncer l'absence d'anomalie avant vérification.

## Conclusion

**Gate validée : NON.**

Les gates préalables sont documentées comme validées. Blocages actuels : approbation du plan détaillé, vérification de pnpm et contrôles finaux non exécutés. Aucun commentaire GitHub, commit, push ou clôture effectué par cet agent dans cette intervention ; le changement Git externe décrit ci-dessus est préservé.

Pour fermer la gate, satisfaire les contrôles obligatoires ci-dessus, consigner les résultats réels et leurs preuves, et résoudre les anomalies bloquantes. Ne pas inclure Vercel, le hors connexion ou la synchronisation entre appareils dans cette conclusion de recette locale.
