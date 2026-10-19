# Phase 3 — plan d'implémentation du parcours Angular

Statut : **plan détaillé approuvé le 19 octobre 2026 par le message utilisateur « commit les docs (pas le nouveau skill) puis tu peux implémenter » ; implémentation autorisée**.

Références : [issue #3](https://github.com/GARNIER-Emmanuel/dyma-claude/issues/3), [spécification](spec.md), [tranche verticale](../../../tranche-verticale.md), [conception](../../../design-doc.md), [consignes du dépôt](../../../AGENTS.md) et [consignes applicatives](../../../src/app/AGENTS.md).

## État vérifié et prérequis

- Issue #3 ouverte, lue avec ses commentaires via le MCP GitHub ; aucun commentaire présent. Elle exige l'approbation du plan détaillé avant modification de l'application. Aucune approbation antérieure de ce plan n'a été retrouvée.
- Branche inspectée : `docs/agent-phase-issue-tracking`, HEAD `f8acb1332851615c80e3e3507f8afdf259fa47f3`. Préserver les trois modifications préexistantes : `docs/phases/02-persistance-locale/preuves/tests-complets.txt`, `docs/phases/03-interface-angular/validation.md` et `docs/phases/README.md`.
- Validations et preuves de phases 1 et 2 relues : gates locales documentées le 18 octobre, 108 puis 270 tests réussis, compilations et types réussis. Ce sont des preuves historiques, sans recette navigateur du parcours Angular.
- Le décalage documentaire signalé par l'issue est déjà corrigé dans la validation locale de phase 3 ; sa publication reste non vérifiée. Les descriptions du socle initial dans la tranche verticale sont historiques : les modèles et le stockage sont désormais présents.
- L'application affiche uniquement `JobView` ; aucun formulaire ni routeur installé. Conserver le test de démarrage qui exige ce titre dans un `h1`.
- Node.js actuel : 24.18.1. `pnpm --version` échoue avant lancement avec `EPERM` dans le cache Corepack. La relance avec autorisation ne démarre pas (`setup refresh had errors`). Version pnpm actuelle et tests actuels non vérifiés ; résoudre ce prérequis avant installation et validation.

## Contrats réutilisés

| Contrat existant | Utilisation |
|---|---|
| `profile/profile.ts` : `Profile` | Compétences en tableau de chaînes, six autres champs en texte libre ; aucune obligation métier supplémentaire. |
| `interviews/interview.ts` : `InterviewDraft`, `Interview`, `Feeling` | Quatre champs obligatoires, deux notes facultatives, feeling facultatif et identité indépendante. |
| `interviews/interview-validation.ts` : `validateInterview` | Source des validations métier après conversion du formulaire ; traduire les erreurs en français. |
| `storage/jobview-storage.ts` : `load`, `saveProfile`, `addInterview` | Seuls accès à la persistance ; réutiliser le service existant sans accès direct au stockage dans les composants. |
| `storage/storage-data.ts` : résultats discriminés de lecture/sauvegarde | Traiter chaque état ; actualiser les données enregistrées uniquement depuis `ready` ou `saved`. |

Les règles et formats de phases 1 et 2 restent inchangés. Une anomalie nécessitant un changement de périmètre sera soumise à arbitrage.

## Fichiers prévus

| Fichiers | Responsabilité |
|---|---|
| `src/app/app.ts`, `app.html`, nouveau `app.css`, `app.spec.ts` | Navigation, chargement initial, état enregistré, sélection liste/création/détail et orchestration des sauvegardes. |
| `src/app/profile/profile-form.ts`, `.html`, `.css`, `.spec.ts` | Formulaire typé, hydratation, soumission et conservation du brouillon après échec. |
| `src/app/interviews/interview-form.ts`, `.html`, `.css`, `.spec.ts` | Saisie, conversion en brouillon métier, validation et erreurs de champs. |
| `src/app/interviews/interview-list.ts`, `.html`, `.css`, `.spec.ts` | Liste simple, état vide et accès à la consultation/création. |
| `src/app/interviews/interview-detail.ts`, `.html`, `.css`, `.spec.ts` | Consultation des informations de la tranche et retour à la liste. |
| `src/app/storage/storage-messages.ts`, `.spec.ts` | Traduction pure et exhaustive des états de lecture et de sauvegarde, sans nouvelle persistance. |
| `src/styles.css` | Couleurs, typographie système, styles communs, focus et adaptation mobile. |
| `package.json`, `pnpm-lock.yaml` | Ajouter uniquement `@angular/forms` en version exacte `22.2.3`, alignée sur Angular existant, pour les formulaires réactifs typés. Préserver `.npmrc`. |
| Documents de phase 3 et `preuves/` | Actualiser les statuts réels ; consigner sorties, recette et captures sans réécrire les preuves historiques. |

Après approbation, créer la branche locale `codex/phase-3-interface-angular` depuis le HEAD inspecté en conservant les modifications présentes ; si elle existe déjà, vérifier son état avant réutilisation. Aucun commit ou push inclus.

## Réalisation

### 1. Navigation et lecture

- Deux espaces « Mon profil » et « Mes entretiens », entretiens affichés par défaut. Navigation avec boutons natifs et état local, sans dépendance de routage : les URL individuelles ne sont pas un critère de la tranche.
- Garder les formulaires montés lors des changements d'espace pour préserver les brouillons ; gérer le focus à chaque changement d'écran.
- `load()` : `empty` initialise les écrans vierges ; `ready` hydrate le profil et la liste.
- `invalid-data`, `unknown-version`, `access-denied` : alerte française et indisponibilité explicite de sauvegarde, sans présenter la lecture échouée comme une liste vide. Saisie conservée, actions d'enregistrement désactivées avec explication accessible.
- Nouvelle tentative de lecture possible sans perdre le brouillon. Aucune remise à zéro ni réparation automatique.

### 2. Profil

- Sept informations prévues, sans nouvelles obligations ni listes de valeurs imposées. Compétences : zone « Une compétence par ligne », conversion LF/CRLF en tableau de chaînes en ignorant les lignes vides ; autres champs en texte libre.
- Soumettre avec `saveProfile()`. Sur `saved`, remplacer l'instantané enregistré par `result.data`, puis annoncer « Profil enregistré ». En cas d'échec, conserver saisie et données antérieures.
- Un profil absent ne bloque jamais un entretien ; modifier le profil ne change aucune note.

### 3. Création d'entretien

- Entreprise, date, poste et contrat obligatoires, contrat en texte libre ; deux notes facultatives de 0 à 10 et sélection facultative du feeling.
- Saisie de date `JJ/MM/AAAA`, conversion sans fuseau horaire vers `YYYY-MM-DD`, puis validation calendaire existante. Années 0001–9999, passé/futur acceptés ; ne pas normaliser une date impossible.
- Une note vide devient une propriété absente ; `0` reste zéro. Ne pas tronquer une décimale ni assimiler une valeur invalide à une absence. Feeling vide : propriété absente.
- À la soumission, appeler `validateInterview`, afficher les erreurs françaises près des champs et placer le focus sur la première erreur. Aucune écriture pour une saisie invalide.
- Générer un identifiant avec `crypto.randomUUID()` lors de la première soumission valide, le conserver pour une nouvelle tentative après échec et utiliser une nouvelle identité pour la création suivante.
- `addInterview()` : sur `saved` seulement, actualiser les données avec le résultat, vider le brouillon et confirmer avec accès au détail. Sur échec, conserver la saisie sans ajout optimiste à la liste. `duplicate-id` reste une erreur.

### 4. Liste, détail et présentation

- Liste dans l'ordre fourni par le stockage, sans tri : entreprise, poste, date, contrat, évaluations et accès au détail. État vide explicite uniquement après lecture sûre.
- `undefined` : « Non noté » ; `0` : « 0 / 10 ». Feeling absent : « Non renseigné ». Aucun calcul de note.
- Détail en lecture seule et retour à la liste. Interpoler les saisies comme texte, sans `innerHTML` ; répartir les textes longs sans masquer les actions.
- Interface sobre à fond clair, accent bleu, typographie système et aucune ressource distante. UI/UX Pro Max confirme l'adéquation du style plat ; sa suggestion de tunnel marketing est écartée car hors du parcours.
- Labels visibles, indications obligatoire/facultatif, `aria-describedby`, `aria-invalid`, erreurs en alerte et confirmations dans une zone de statut. Effacer une ancienne confirmation lorsqu'une nouvelle saisie ou tentative la rend trompeuse.
- Navigation clavier, focus visible, cibles d'au moins 44 px, contraste lisible. Une colonne sur mobile, largeur maîtrisée sur PC, aucun débordement horizontal ; respecter les préférences de réduction des animations si nécessaire.

## Contrôles prévus

Ces contrôles ne sont pas exécutés par la rédaction du plan.

| Niveau | Scénarios et assertions |
|---|---|
| Formulaires | Profil complet/vide, hydratation et compétences multilignes ; entretien sans profil, quatre champs requis, dates impossibles/années limites, notes absente/0/10/hors bornes/décimales, feeling facultatif. Soumissions depuis le DOM et erreurs françaises associées aux champs. |
| Liste et détail | État vide sûr, sélection/retour, 0 distinct de l'absence, feeling absent, entretiens indépendants et chaînes ressemblant à du HTML affichées comme texte. |
| Intégration TestBed | Vrai service avec stockage fictif via `JOBVIEW_STORAGE_ACCESS` : sauvegardes successives, relecture par une nouvelle instance, conservation du profil et des entretiens, notes inchangées après modification du profil/feeling. |
| Échecs | Lecture illisible, format invalide, version inconnue et accès refusé ; stockage devenu non sûr entre chargement et écriture ; quota, refus d'écriture, échec générique, entrée invalide et identité dupliquée. Alerte, brouillon conservé, aucune fausse confirmation, données antérieures préservées, aucune écriture après lecture non sûre. |
| Confirmation | Observer l'interface pendant `setItem` : aucune confirmation prématurée. Réussite affichée après `saved` ; échec suivi d'une nouvelle tentative réussie sans perte de saisie. |
| Commandes | Conserver le test de démarrage ; `pnpm test`, `pnpm build` et `pnpm exec tsc --project tsconfig.spec.json --noEmit` sur le même état final. |
| Navigateur PC | `pnpm dev`, `http://localhost:4200`, navigateur/version à relever, 1440 × 900 : clavier, état vide, création sans profil, notes absente/zéro, détail, profil enregistré/modifié, erreurs et confirmations. |
| Navigateur mobile | Même adresse, 390 × 844 puis 320 × 740 : parcours essentiel, champs et actions accessibles, focus visible, aucun défilement horizontal. Identifier l'émulation de viewport comme telle. |
| Erreurs navigateur | Contexte isolé avec données fictives : préparer contenu illisible/version inconnue et simuler refus de lecture/écriture et quota avant chargement. Vérifier alerte, blocage, contenu préservé, brouillon conservé et nouvelle tentative. Ne pas toucher au stockage personnel. |

Conserver dans `preuves/` : `tests-complets.txt`, `compilation.txt`, `types.txt`, `recette-navigateur.md` et captures des écrans essentiels (vide, formulaire invalide, détail avec 0/absence, profil, erreur de stockage et mobile). Relever date Europe/Paris, branche, HEAD/changements locaux, versions, adresse, navigateur, tailles et scénarios.

Renseigner `validation.md` avec **réussi**, **échoué** ou **non vérifié**, en séparant commandes et navigateur. Revoir le diff, les dépendances et la préservation du travail existant. Tout contrôle obligatoire absent ou échoué bloque la gate.

## Exclusions et approbation

Tris, filtres, recherche, modification/suppression d'entretiens, effacement global, champs d'entretien reportés, backend et déploiement restent exclus. Fermeture/réouverture complète et inspection réseau finale appartiennent à la phase 4, qui exige sa propre approbation.

L'approbation attendue porte sur ce plan détaillé, l'ajout unique de dépendance et ses contrôles. Elle autorisera l'implémentation locale de phase 3. Commentaire GitHub, commit, push et clôture nécessitent toujours une autorisation explicite distincte. La gate reste **non validée**.
