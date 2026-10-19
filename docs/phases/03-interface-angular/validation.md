# Phase 3 — validation et preuves

Statut : **gate locale de phase 3 validée le 19 octobre 2026** ; implémentation commitée dans `11c2724`. [Issue #3](https://github.com/GARNIER-Emmanuel/dyma-claude/issues/3) fermée comme terminée le même jour. La [recette locale de phase 4](../04-recette-finale/validation.md) a ensuite été réalisée et validée ; les états de publication ci-dessous décrivent les revues historiques de phase 3.

Références : [spécification](spec.md) et [plan](plan-implementation.md).

## Contrôles obligatoires

- [x] Les gates locales des phases 1 et 2 sont documentées comme validées le 18 octobre 2026 ; leurs validations et preuves ont été relues lors de la revue documentaire du 19 octobre (voir ci-dessous).
- [x] Le plan détaillé de phase 3 est préparé et approuvé par le message utilisateur « commit les docs (pas le nouveau skill) puis tu peux implémenter », le 19 octobre 2026.
- [x] Le profil est enregistrable ; un entretien peut être créé sans profil puis listé et consulté.
- [x] La saisie invalide, les états vides et les notes absentes/zéro sont traités correctement.
- [x] Les erreurs de lecture et de sauvegarde sont visibles, sans remise à zéro automatique.
- [x] La confirmation suit une écriture réussie ; la saisie est conservée après échec.
- [x] Le parcours clavier, mobile et PC est observé et documenté (mobile : viewports émulés).
- [x] Les saisies sont affichées comme du texte et les accès au stockage passent par le service unique.
- [x] Le test de démarrage et les tests d'interface ciblés restent réussis.
- [x] `pnpm test` réussit sur le code de la phase, avec une sortie conservée.
- [x] `pnpm build` réussit sur le même état du code, avec une sortie conservée.
- [x] La revue Git confirme le respect du périmètre, l'absence de fonctionnalités anticipées et de dépendances inutiles, et les tests des cas limites.

## Environnement et état du code

- Date : 19 octobre 2026, Europe/Paris ; recette finale à 21:38:23, tests à 21:38:49 et compilation terminée à 21:38:50.
- Branche : `codex/phase-3-interface-angular`, HEAD `f75cb31` (commit documentaire autorisé ; quatre fichiers, aucun skill). L'implémentation et ses preuves restent des modifications locales non commitées.
- Windows, PowerShell, Node.js 24.18.1, pnpm 10.15.1, Angular 22.2.3, Vitest 5.0.0 et jsdom 30.0.0.
- Avant les commandes pnpm, variable de processus : `$env:COREPACK_HOME = Join-Path (Get-Location) '.pnpm-store/corepack'`. Cache local déjà ignoré par Git ; aucune modification globale, de `.npmrc`, d'ACL ou d'autorisation de lecture des fichiers protégés.
- Dépendance directe ajoutée : `@angular/forms` 22.2.3, versions existantes conservées et verrou mises à jour. `pnpm install --frozen-lockfile` réussi ; scripts natifs non autorisés par la configuration existante laissés ignorés.
- Serveur : `pnpm dev --host 127.0.0.1`, `http://127.0.0.1:4200/`. Chromium 155.0.8059.85 via MCP Playwright ; PC 1440 × 900, mobile émulé 390 × 844 et 320 × 740. Contextes isolés, données fictives, contextes fermés après chaque scénario.

## Résultats

| Contrôle ou scénario | Résultat attendu | Résultat observé | Preuve | Statut |
|---|---|---|---|---|
| `pnpm test` | Tests existants et nouveaux réussis | 319 tests dans 8 fichiers, dont test de démarrage conservé et 49 cas ajoutés | [Sortie complète](preuves/tests-complets.txt) | Réussi |
| `pnpm build` | Production compilée | 221,53 kB bruts initiaux ; sortie `dist/jobview/browser/`, code de sortie 0 | [Compilation](preuves/compilation.txt) | Réussi |
| `pnpm exec tsc --project tsconfig.spec.json --noEmit` | Aucun diagnostic | Code de sortie 0 | [Types](preuves/types.txt) | Réussi |
| `pnpm install --frozen-lockfile` | Verrou cohérent | Résolution ignorée, verrou à jour ; versions exactes respectées | [Installation](preuves/installation.txt) | Réussi |
| Navigation, formulaires et persistance | Profil et entretien utilisables, sans profil préalable obligatoire | Sept informations du profil, création/listage/détail, deux identités indépendantes, rechargement, brouillons conservés | Tests et [recette](preuves/recette-navigateur.md) | Réussi |
| Validations et texte | Français, zéro distinct de l'absence, dates et notes invalides refusées, HTML non interprété | Cas limites TestBed et 13 scénarios navigateur, y compris textes longs à 320 px | [Résultats navigateur](preuves/resultats-navigateur.json), captures liées dans la recette | Réussi |
| Stockage non sûr | Erreur visible, aucune écriture de remplacement | JSON/format invalides, version inconnue et refus de lecture au démarrage ; stockage devenu illisible entre lecture et écriture testé avec le vrai service | Tests et recette | Réussi |
| Écriture et confirmations | Saisie/données préservées, aucune fausse réussite | Quota, refus, erreur générique, entrée invalide et doublon couverts ; nouvelle tentative réussie ; absence de confirmation pendant `setItem` vérifiée par TestBed | Tests, [quota](preuves/echec-QuotaExceededError.png), [données antérieures](preuves/mobile-echec-donnees-conservees.png) | Réussi |
| PC, mobile et clavier | Actions accessibles sans débordement | Parcours aux trois tailles, parcours intégral Tab/Entrée sur PC, focus au premier champ invalide et au détail | Recette, [clavier](preuves/pc-clavier.png), captures mobiles | Réussi |
| Revue locale du périmètre | Aucun ajout anticipé ni accès au stockage hors service | Modèles/validations/service inchangés, une dépendance directe, saisies interpolées, aucune fonction métier reportée | Revue des sources, du diff et `git diff --check` | Réussi |

## Anomalies et revue

Revue locale réalisée sur les composants, les templates, les messages et les tests : accès au stockage uniquement via `JobViewStorage`, mises à jour après `saved`, distinction explicite `undefined`/zéro, aucun `innerHTML`, réseau applicatif, filtre, tri, modification/suppression d'entretien ou dépendance de routage. Les modèles, validations et le service des phases 1 et 2 sont inchangés. Aucun défaut bloquant relevé dans le périmètre observé.

Premiers contrôles et corrections :

- Erreur TypeScript dans le nouveau test : espion `getItem` initialement typé sans argument. Signature corrigée ; compilation des tests puis 319 tests réussis.
- Tentatives initiales pnpm bloquées par le cache global Corepack ; relance avec autorisation impossible au démarrage de l'outil. Cache placé dans le dossier local ignoré par Git, sans élargir les permissions ; pnpm 10.15.1 vérifié et commandes réussies.
- Vitest/Vite tentait de charger automatiquement un fichier d'environnement protégé. Lecture refusée, aucun contenu lu. `envDir: false` et un plugin de configuration appliquant le même réglage au projet Vitest construit par Angular désactivent ce chargement. Configuration dans `vitest-base.config.mts` et `angular.json` ; suite complète réussie ensuite.
- Ajustement de rangement : styles partagés des formulaires/détail dans `src/styles.css`, CSS propres à la coquille et à la liste seulement.

Le dossier `.agents/skills/create-issues/` reste non suivi et intact. Les preuves des phases précédentes commitées avant implémentation ne sont pas modifiées ensuite. Aucun commit du code, push, commentaire ou clôture GitHub réalisé.

Les revues ci-dessous sont historiques ; leurs mentions « non vérifié » et « approbation en attente » décrivent les interventions antérieures aux contrôles ci-dessus.

### Revue documentaire du 19 octobre 2026 — issue #2

- Périmètre autorisé : finalisation documentaire du suivi des interventions, selon le plan présenté dans la conversation puis approuvé par le message utilisateur « implémente ». Cette approbation ne porte pas sur le plan de phase 3.
- État relu : branche `docs/agent-phase-issue-tracking`, commit de départ `e54a0af104efdba680b83ba463c3bb8e2db4bdef`, corrections documentaires locales non commitées. La modification préexistante de `../02-persistance-locale/preuves/tests-complets.txt` est conservée.
- Environnement de revue : Windows, PowerShell 7.6.5, Node.js 24.18.1. Vérifications documentaires avec Git et un contrôle ponctuel des cibles de liens locaux par Node.js ; pnpm non utilisé.
- Sources relues : [validation de phase 1](../01-modeles-validations-metier/validation.md), [validation de phase 2](../02-persistance-locale/validation.md) et leurs preuves liées de tests, compilation et types. Elles documentent respectivement 108 et 270 tests réussis, ainsi que des compilations réussies le 18 octobre ; ces contrôles n'ont pas été réexécutés dans cette intervention.
- Résultat de la revue : la conclusion ci-dessous est corrigée pour distinguer les prérequis locaux documentés des contrôles de phase 3 encore non vérifiés. Le plan de phase 3 reste un support non détaillé et non approuvé ; l'interface inspectée affiche toujours uniquement « JobView ».
- Tests, compilation et observations navigateur de phase 3 : **non vérifiés**. Aucune implémentation ni validation de gate de phase 3 n'est effectuée par cette revue.

### Préparation du plan du 19 octobre 2026 — issue #3

- Issue #3 et commentaires lus via le MCP GitHub ; aucun commentaire. L'issue impose un plan détaillé approuvé avant modification de l'application.
- Sources métier, contrats du service, composants actuels, spécification et preuves des phases 1 et 2 relus. Les preuves historiques indiquent 108 puis 270 tests réussis ; elles ne sont pas une exécution actuelle.
- [Plan détaillé](plan-implementation.md) préparé : navigation, profil, création, liste/détail, protection du stockage, tests et parcours navigateur. Approbation explicite **en attente** ; aucune source de l'application modifiée dans cette intervention.
- État : branche `docs/agent-phase-issue-tracking`, HEAD `f8acb1332851615c80e3e3507f8afdf259fa47f3`. Les trois modifications locales préexistantes sont conservées ; le plan et ce complément de validation constituent les seuls changements de cette intervention.
- Environnement : Windows/PowerShell, Node.js 24.18.1. Vérification actuelle de pnpm **échouée** avant lancement : `EPERM` lors de la création d'un répertoire dans le cache Corepack. La relance avec autorisation n'a pas démarré (`setup refresh had errors`). Version pnpm actuelle **non vérifiée**. Aucun changement de configuration effectué pour contourner ce problème.
- Tests applicatifs, compilation et observations navigateur actuels : **non vérifiés**. La préparation du plan ne valide aucune gate et n'autorise pas la phase 4.
- Contrôles documentaires : `git diff --check` réussi ; les cinq liens locaux du plan ont des cibles existantes. Un dossier non suivi `.agents/skills/create-issues/`, apparu lors de la revue finale, est laissé intact et hors périmètre de cette intervention.

## Conclusion

**Gate locale phase 3 validée : OUI**, sur les commandes, tests simulés et observations Chromium décrits ci-dessus.

Les gates locales des phases 1 et 2 sont documentées comme validées le 18 octobre 2026 dans leurs validations et preuves respectives. Elles ne constituent pas une recette navigateur du parcours Angular.

Le profil, la création sans profil, la liste et le détail sont reliés aux contrats existants. Tous les contrôles obligatoires de phase 3 sont réussis. L'issue #3 est fermée comme terminée ; la branche d'implémentation reste locale.

**Non vérifié et hors de cette gate :** fermeture/réouverture complète du navigateur, inspection réseau finale, téléphone physique, autre navigateur et déploiement Vercel. Le rechargement testé ne remplace pas une réouverture complète. La limite de concurrence entre onglets de localStorage reste celle du service de phase 2.

La phase 4 peut être planifiée ; elle n'est pas commencée et exige l'approbation de son propre plan. Les travaux applicatifs sont committés localement dans `11c2724`, sans publication de la branche.

## Revue de clôture du 19 octobre 2026 — issue #3

- Autorisation explicite : « marque l'issue 3 complete et ferme la correctement ».
- État contrôlé : branche `codex/phase-3-interface-angular`, HEAD `e66e4d9366a172796db01e99a92ce2b784dbd623`, arbre de travail propre avant cette revue. Implémentation et preuves incluses dans `11c2724e937057271ae91891e92178bbd35872ae` ; aucun changement du code applicatif, de sa configuration ou des preuves entre ce commit et HEAD.
- Environnement de revue : Windows/PowerShell, Git et MCP GitHub. L'environnement d'exécution des preuves reste celui décrit plus haut.
- **Réussi :** lecture de l'issue et de ses commentaires via le MCP (aucun commentaire), revue du plan approuvé, des gates précédentes, du code et des preuves conservées : 319 tests, compilation, types et 13 scénarios navigateur réussis. Aucun contrôle obligatoire manquant ou échoué dans ce périmètre. Les commandes et parcours navigateur n'ont pas été réexécutés pendant cette revue.
- **Publication non réalisée :** lecture GitHub de la branche via le MCP en échec 404, référence absente. Aucun push ni merge effectué ; les références à `main` dans l'issue ne prouvent pas la publication du code de phase 3.
- **Réussi :** huit critères cochés, bilan de clôture et limites ajoutés dans l'issue. Le MCP confirme `state: closed`, `state_reason: completed`, clôture le 19 octobre 2026 à 22:00:39 Europe/Paris.
- Les états « non commité », « non suivi » et « issue ouverte » dans les comptes rendus antérieurs décrivent leur état historique. Cette revue actualise uniquement la documentation locale ; aucun nouveau commit effectué.
