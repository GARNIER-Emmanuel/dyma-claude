# Phase 4 — Recette finale

Statut : spécification issue de la tranche verticale ; implémentation non commencée et gate non validée.

Source : [tranche-verticale.md — Phase 4 — Validation de la tranche](../../../tranche-verticale.md). Lire également le [design-doc](../../../design-doc.md) et les [consignes applicables](../../../AGENTS.md).

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

## Documents de travail

- [Plan d'implémentation](plan-implementation.md).
- [Validation et preuves](validation.md).
