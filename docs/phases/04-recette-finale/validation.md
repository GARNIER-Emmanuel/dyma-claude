# Phase 4 — validation et preuves

Statut : **gate locale de phase 4 validée le 19 octobre 2026**, sur le code de référence `9ec7287`, inchangé pendant la recette. Preuves réunies dans le présent commit de recette finale ; clôture de l'issue #5 autorisée après ce commit. Publication de la branche non effectuée dans cette intervention.

Références : [spécification](spec.md) et [plan](plan-implementation.md).

## Contrôles obligatoires

- [x] Les gates locales de phases 1 à 3 sont documentées comme validées ; validations et preuves relues.
- [x] Le plan détaillé de recette est explicitement approuvé avant exécution par « commit puis implemente ».
- [x] Le profil et les trois entretiens sont retrouvés après fermeture complète et réouverture du navigateur à la même origine et dans le même profil dédié, aux trois tailles.
- [x] La création sans profil, la liste et la consultation sont vérifiées.
- [x] L'absence de note, zéro et l'indépendance des évaluations sont vérifiés.
- [x] La saisie invalide est refusée avec une erreur visible, sans écriture.
- [x] Un échec de sauvegarde maîtrisé est observé sans perte de données ni fausse confirmation, pour entretien et profil ; nouvelle tentative réussie.
- [x] Le parcours mobile émulé et PC est vérifié, avec captures inspectées et limites documentées.
- [x] L'inspection réseau pendant les scénarios ne révèle aucune transmission de données métier.
- [x] L'adresse locale, le navigateur, les profils dédiés et l'environnement sont consignés.
- [x] `pnpm test` réussit sur le code de la phase, avec sortie et code de sortie conservés.
- [x] `pnpm build` réussit sur le même état du code, avec sortie et code de sortie conservés.
- [x] La revue Git confirme le respect du périmètre, aucune modification applicative ou dépendance nouvelle ; contrôles des cas limites réalisés.

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

### Exécution après approbation

- Autorisation utilisateur : **« commit puis implemente »**. Commit documentaire créé avant la recette : **`9ec7287`**, message « Documente et approuve le plan de recette finale » ; branche `codex/phase-4-recette-finale`.
- Code applicatif de `9ec7287`, identique à `11c2724`, sans modification de `src/`, `package.json`, du verrou, d'`angular.json`, de `vitest-base.config.mts` ou de `.npmrc` pendant les vérifications. Le pilote, les preuves et la documentation constituent les seuls changements locaux suivants.
- Windows/PowerShell 7 ; Node.js **24.18.1**, pnpm **10.15.1**, Angular **22.2.3**, Vitest **5.0.0**, jsdom **30.0.0**. Le blocage Corepack initial est résolu en réutilisant le cache existant `.pnpm-store/corepack` via `COREPACK_HOME` au niveau du processus ; aucune modification globale ou de permission.
- `pnpm test` : **22:12:12 Europe/Paris**, 319 tests dans 8 fichiers ; `pnpm build` terminé à **22:13:08**. Même état applicatif, codes de sortie 0 conservés dans les preuves.
- Navigateur Chrome/Chromium **155.0.8059.85**, exécutable existant `C:/Program Files/Google/Chrome/Application/chrome.exe`, mode headless, piloté par MCP Playwright. PC **1440 × 900**, mobile émulé **390 × 844** et **320 × 740** ; mode mobile/capacité tactile activés pour les mobiles, user-agents effectifs et options dans les JSON. Aucun appareil physique testé.
- Origine stable **http://127.0.0.1:4200/**, serveur préexistant PID `50508`, HTTP 200. Les 15 sources applicatives de sa source map sont identiques aux fichiers locaux (normalisation des fins de ligne). Sa ligne de commande WMI n'est pas accessible ; correspondance établie par les sources servies. Aucun serveur utilisateur arrêté.
- Dernière recette complète : **22:15:43 à 22:15:53 Europe/Paris**, après correction du pilote uniquement ; 21 scénarios réussis, aucun `pageerror`. Les horodatages JSON sont en UTC.
- Trois profils neufs dédiés, sous `.angular/jobview-phase4/`, suffixe `2026-10-19T20-15-43-420Z`, mêmes dossiers réutilisés uniquement pour la réouverture de chaque variante. Aucun export/import ou préremplissage du stockage. Déconnexion complète puis nouveau lancement attestés dans [reouverture.json](preuves/reouverture.json).
- 43 captures conservées ; huit ouvertes et inspectées : liste après réouverture PC, échec entretien PC, clavier PC, formulaire 390, échec profil 390, détail et profil 320 après réouverture, requis 320. Messages lisibles, focus visible, actions accessibles ; 49 mesures sans débordement horizontal.
- Navigateurs dédiés fermés et méthodes simulées restaurées. Les 19 dossiers de profils fictifs des tentatives et du contrôle de lancement restent dans `.angular/jobview-phase4/`, ignoré par Git ; aucun profil brut livré. Serveur préexistant conservé, aucun serveur propre à cette recette encore actif.

## Résultats

| Contrôle ou scénario | Résultat attendu | Résultat observé | Preuve | Statut |
|---|---|---|---|---|
| Prérequis phases 1 à 3 | Gates documentées et preuves disponibles | Validations et preuves historiques relues | Documents liés ci-dessus et historique Git | Réussi (revue documentaire) |
| Approbation du plan | Accord explicite avant recette | Message « commit puis implemente », après présentation du plan | Conversation du 19 octobre 2026 | Réussi |
| Version pnpm | 10.15.1 disponible | 10.15.1 vérifiée avec le cache local existant | Environnement ci-dessus et commandes exécutées | Réussi ; blocage initial résolu |
| Tests unitaires finaux | Réussite sur l'état final | 319 tests dans 8 fichiers, code 0 | [Sortie complète](preuves/tests-complets.txt) | Réussi |
| Compilation finale | Réussite sur le même état des sources | 221,53 kB initiaux, code 0, sortie `dist/jobview/browser/` | [Compilation](preuves/compilation.txt) | Réussi |
| S1 — Sans profil, liste/détail et notes | Création, zéro et absence distincts | Profil null, zéro stocké, compatibilité absente et affichage exact aux trois tailles | [Résultats](preuves/resultats-navigateur.json), [recette](preuves/recette-navigateur.md) | Réussi |
| S2 — Profil et indépendance | Profil sauvegardé, évaluations conservées | P1 puis P2 sauvegardés, A inchangé, B indépendant malgré son feeling différent | Résultats et recette | Réussi |
| S3 — Saisies invalides | Erreurs visibles et stockage inchangé | Champs requis, date impossible et -1/11/2.5 pour les deux notes refusés ; contenu inchangé | Résultats, [capture 320](preuves/mobile-320-invalide-requis.png) | Réussi |
| S4 — Échec maîtrisé | Saisie et données conservées, aucun faux succès | Deux écritures échouées par profil, brouillons/données conservés, nouvelle tentative réussie sans doublon | Résultats, [échec entretien](preuves/pc-echec-entretien.png), [échec profil](preuves/mobile-390-echec-profil.png) | Réussi |
| S5 — Réouverture complète | Données exactes après arrêt/reprise du navigateur | Trois déconnexions complètes et nouveaux lancements ; même stockage, 7 informations et 3 entretiens consultés par profil | [Réouvertures](preuves/reouverture.json), captures avant/après dans la recette | Réussi |
| S6 — PC, mobile émulé et clavier | Parcours utilisable, captures inspectées | 49 mesures sans débordement, parcours clavier PC, 43 captures dont 8 inspectées | Résultats, recette, [clavier](preuves/pc-clavier.png) | Réussi |
| S7 — Réseau | Aucune transmission métier observée | 90 GET locaux sans corps, HTTP 200 ; 6 WebSocket, aucune frame sortante, messages reçus de connexion uniquement | [Réseau](preuves/reseau.json), analyse manuelle dans la recette | Réussi dans les scénarios observés |
| Revue du périmètre et preuves | Aucun contrôle obligatoire absent | Sources/configuration/dépendances inchangées ; sorties et JSON relus, captures inspectées ; liens et diff contrôlés | Revue finale et preuves liées | Réussi |

Les anciens états « échoué » ou « non vérifié » de la préparation restent décrits dans l'historique ci-dessus ; la table donne les résultats finaux. Aucun contrôle obligatoire de la recette locale ne reste échoué ou non vérifié.

## Anomalies et revue

### Autorisation d'exécution du 19 octobre 2026

Le message utilisateur « commit puis implemente » approuve le plan détaillé et demande le commit documentaire avant son exécution. L'état « approbation en attente » de la préparation ci-dessus est historique. Les anomalies applicatives restent à présenter avant correction ; aucun push, commentaire ou clôture GitHub n'est demandé.

Les premières tentatives ont révélé des erreurs du pilote (retour explicite à la liste, attente du rendu Angular et sélecteurs non uniques pour deux entretiens similaires et le parcours clavier). Le pilote seul a été corrigé, puis les 21 scénarios ont été réexécutés avec succès. Le [diagnostic initial](preuves/diagnostic-pilote.json) et la [recette](preuves/recette-navigateur.md) documentent ces limites. Aucun changement applicatif et aucun défaut applicatif bloquant constaté dans le périmètre final observé.

Les URL, corps et frames du relevé réseau ont été examinés : chargements techniques locaux uniquement, sans transmission métier. Le jeton éphémère de connexion Vite est masqué dans les preuves sauvegardées, après analyse ; aucun jeton conservé en clair dans les livrables. La portée de cette conclusion reste celle des pages et transports observés pendant la recette.

Revue finale : `git diff --check` réussi ; toutes les cibles de liens locaux existent ; JSON valides avec 21 scénarios réussis et trois réouvertures cohérentes ; 43 captures présentes. Aucun jeton Vite en clair dans les preuves JSON. [Correspondance des sources servies](preuves/verification-serveur.json) vérifiée à nouveau après recette. Diff applicatif/configuration/dépendances vide depuis `9ec7287` ; caches et profils exclus par les règles Git existantes. La modification de `spec.md` actualise uniquement sa ligne de statut, sans changer les critères.

## Conclusion

**Gate locale phase 4 validée : OUI.**

Plan explicitement approuvé, 319 tests réussis, compilation réussie, 21 scénarios navigateur réussis, persistance après arrêt complet prouvée aux trois tailles et aucune transmission métier observée dans le relevé réseau. Les limites d'émulation et de périmètre sont explicites dans la recette.

Le commit documentaire initial est `9ec7287`. Le présent commit de recette finale regroupe le pilote, les sorties, JSON, captures et mises à jour documentaires. Le message utilisateur « commit et cloture l'issue » autorise ce commit puis la clôture de l'issue #5 avec bilan des résultats et limites. La revue de livraison a relu les preuves sans réexécuter les tests ou scénarios : code applicatif et configuration inchangés depuis `9ec7287`, 319 tests réussis, compilation code 0, 21 scénarios réussis et trois réouvertures cohérentes, 43 captures présentes. La clôture distante est effectuée après création du commit et son résultat doit être vérifié via le MCP GitHub. Aucun push n'est demandé ni effectué. Téléphone physique, autre moteur de navigateur, Vercel, hors connexion et synchronisation entre appareils restent non vérifiés et hors périmètre de cette validation locale.
