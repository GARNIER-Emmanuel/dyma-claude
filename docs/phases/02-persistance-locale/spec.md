# Phase 2 — Persistance locale protégée

Statut : spécification issue de la tranche verticale ; implémentation non commencée et gate non validée.

Source : [tranche-verticale.md — Phase 2 — Persistance locale protégée](../../../tranche-verticale.md). Lire également le [design-doc](../../../design-doc.md) et les [consignes applicables](../../../AGENTS.md).

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

## Documents de travail

- [Plan d'implémentation](plan-implementation.md).
- [Validation et preuves](validation.md).
