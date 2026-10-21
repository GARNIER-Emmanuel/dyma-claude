# JobView — première tranche verticale

## Cible fonctionnelle

Permettre un premier parcours complet dans les espaces **Mon profil** et **Mes entretiens** :

1. Renseigner et enregistrer le profil : compétences, métier recherché, fourchette de salaire souhaitée, horaires, télétravail, localisation et contrat recherché.
2. Créer un entretien avec les quatre champs obligatoires : entreprise, date de l’entretien, poste et contrat.
3. Ajouter facultativement les deux notes manuelles, « Performance des conditions » et « Compatibilité », ainsi que le feeling : « Super bon », « OK » ou « Pas top ».
4. Retrouver l’entretien dans une liste simple et consulter ses informations.
5. Fermer puis rouvrir le navigateur à la même adresse et retrouver le profil et l’entretien enregistrés.

Le profil sert uniquement d’aide-mémoire. Son absence ne bloque pas la création d’un entretien et sa modification ne change aucune évaluation. Aucun score n’est calculé. Le feeling ne modifie jamais les notes ; chaque entretien est indépendant, même à entreprise et poste identiques. Une note absente ne vaut pas zéro et s’affiche « Non noté ».

## Limites de la tranche

Les autres champs facultatifs des entretiens sont reportés : mission, compte rendu, outils, avantages et primes, salaire, horaires, télétravail et localisation. Leur présence dans le profil reste prévue lorsqu’elle figure dans la cible ci-dessus.

La modification et la suppression des entretiens, l’effacement global, les tris, la recherche et les filtres appartiennent aux tranches suivantes. La liste de cette tranche donne seulement accès aux informations essentielles et au détail ; le tableau de comparaison complet de la V1 n’est pas un prérequis.

Les exclusions de la V1 sont conservées : aucun compte, backend, base distante, synchronisation, partage, import de CV, IA, score calculé, export, sauvegarde externe ou PWA. Le fonctionnement hors connexion n’est pas garanti. Les données restent dans le navigateur ; mobile et PC conservent des données indépendantes. La persistance visée suppose le même navigateur, le même profil de navigation et la même origine du site, sans effacement du stockage.

Le déploiement Vercel et sa recette à une adresse stable seront validés séparément. Ils ne conditionnent pas la recette locale de cette tranche.

## Cohérence avec le dépôt et méthode

Ce plan s’appuie sur [design-doc.md](design-doc.md), [README.md](README.md), [AGENTS.md](AGENTS.md), [src/app/AGENTS.md](src/app/AGENTS.md) et les sources actuelles. Le design-doc décrit une V1 plus large ; les limites ci-dessus en sélectionnent le premier parcours.

Le dépôt contient une seule application Angular, avec ses sources dans `src/`. Les composants, types et validations sont regroupés dans `src/app/profile/` et `src/app/interviews/`, avec les tests à proximité. Le service `JobViewStorage` et le format versionné sont dans `src/app/storage/`. Le composant racine relie le profil, la création d’entretien, la liste et le détail à ce service. Aucune couche ou package partagé supplémentaire n’est prévu sans besoin concret.

L’environnement de référence est Node.js **24.18.1** et pnpm **10.15.1**. Les scripts existants sont `pnpm dev`, `pnpm test` et `pnpm build` ; aucun script lint ou typecheck n’est prévu. Les tests utilisent Vitest, jsdom et Angular TestBed selon leur périmètre.

Les phases sont successives. Chaque gate ci-dessous exige des résultats observés et des preuves avant de passer à la suivante. Ce document définit le périmètre et les critères ; les choix détaillés, les résultats datés et les limites de validation sont consignés dans les [plans et validations par phase](docs/phases/README.md).

## Phase 1 — Données et validations métier

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

## Phase 2 — Persistance locale protégée

### Objectif

Conserver le profil et les entretiens entre deux ouvertures du navigateur sans mettre en danger les données déjà présentes.

### Périmètre

- Prévoir un service Angular unique pour tous les accès à `localStorage` et un format versionné contenant le profil et les entretiens.
- Distinguer explicitement le stockage vide, les données lisibles et utilisables, le contenu illisible ou inexploitable, la version inconnue et l’accès refusé. Un échec de lecture ne devient jamais un stockage vide.
- Autoriser une initialisation lorsque le stockage est réellement vide. Empêcher l’écrasement lorsque les données existantes ne peuvent pas être utilisées avec sûreté, notamment si elles sont illisibles ou d’une version inconnue, ou si leur lecture est refusée.
- Prévoir la sauvegarde et la relecture du profil et des entretiens : enregistrer le profil doit conserver les entretiens, et créer un entretien doit conserver le profil et les autres entretiens.
- Remonter les échecs d’accès ou d’écriture, notamment un stockage saturé, afin que l’interface puisse les afficher. Ne pas transformer un échec en réussite ; conserver les données persistées antérieures.

### Livrables

Le service de stockage, la description du format versionné et des états de lecture/sauvegarde, ainsi que des tests utilisant un stockage simulé et des données fictives. Aucun outil de migration, de récupération ou d’effacement n’est inclus dans cette tranche.

### Jalon de fin et gate vers la phase 3

- **Vérification prévue :** exécuter avec `pnpm test` les tests de sauvegarde puis relecture du profil et des entretiens, de conservation des données lors des écritures successives, et les simulations de lecture refusée, contenu illisible, version inconnue, écriture refusée et stockage saturé.
- **Résultat attendu :** les données relues correspondent aux données enregistrées, notamment pour zéro et l’absence de note. Les états sont distingués et les échecs remontés. Les données existantes restent intactes après une lecture non sûre ou une écriture échouée.
- **Preuve nécessaire :** résultats des tests et assertions montrant la conservation du contenu initial dans les scénarios de protection et d’échec. Les tests doivent établir qu’aucune écriture de remplacement n’est tentée après une lecture non sûre. Tout échec bloque le passage à la phase 3.

## Phase 3 — Parcours Angular de bout en bout

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

## Phase 4 — Validation de la tranche

### Objectif

Établir la preuve du parcours complet et de sa persistance réelle, avec des données exclusivement fictives.

### Périmètre

Prévoir une recette comprenant :

- Un profil enregistré avec les informations prévues, puis retrouvé après réouverture.
- Un entretien créé, visible dans la liste puis consultable, y compris sans profil préalablement enregistré.
- Une note absente affichée « Non noté », une note zéro conservée comme telle, et des évaluations non modifiées par le feeling ou le profil.
- Une saisie invalide refusée avec une erreur visible, sans enregistrement.
- Un échec de sauvegarde simulé et maîtrisé, avec erreur visible, sans confirmation de réussite ni perte des données déjà enregistrées.
- La fermeture complète puis la réouverture du navigateur à la même adresse, dans le même profil de navigation, suivies de la consultation du profil et des entretiens. Un simple rechargement de page ne suffit pas pour ce scénario.
- Le parcours sur mobile et PC, avec une inspection réseau pendant la saisie, l’enregistrement et la consultation pour rechercher toute transmission de données métier.

La recette utilise une adresse locale stable, avec le serveur disponible lors de la réouverture. Elle ne valide ni Vercel, ni le fonctionnement hors connexion, ni une synchronisation entre appareils.

### Livrables

Un compte rendu de recette indiquant les scénarios, l’environnement, les résultats observés, les preuves et les éventuelles anomalies. Il réunira les sorties des commandes, les observations de réouverture, les captures utiles et le relevé d’inspection réseau. Son support sera décidé lors du plan d’implémentation de cette phase.

### Jalon de fin et gate de clôture

- **Vérification prévue :** exécuter `pnpm test` et `pnpm build` sur l’état final, puis effectuer tous les scénarios de recette dans le navigateur, dont la fermeture/réouverture, le parcours mobile et l’inspection réseau.
- **Résultat attendu :** les deux commandes réussissent ; le profil et les entretiens enregistrés sont retrouvés après réouverture ; les règles et erreurs sont respectées ; le parcours fonctionne sur mobile et PC ; aucune donnée métier n’est transmise sur le réseau pendant les scénarios observés.
- **Preuve nécessaire :** sorties réussies de `pnpm test` et `pnpm build`, compte rendu de recette avec adresse et navigateur utilisés, constats avant/après fermeture, preuves visuelles du parcours mobile et relevé réseau associé aux scénarios. Tout contrôle absent reste explicitement « non vérifié » et empêche de déclarer la tranche validée.

Les fonctionnalités reportées nécessitent un périmètre et un plan approuvés avant leur implémentation.
