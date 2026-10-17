# Règles de l’application JobView

Ces consignes concernent `src/app/` et ses sous-dossiers. Elles complètent
`AGENTS.md` à la racine. Respecter le périmètre décrit dans `design-doc.md`.

## Logique métier

- Écrire les validations, tris et filtres comme des fonctions pures : mêmes
  entrées, mêmes résultats, sans modifier les données reçues.
- Ces fonctions ne doivent accéder ni au stockage, ni au réseau, ni au DOM.
  Les composants gèrent l’affichage ; le service de stockage gère la persistance.
- Exiger l’entreprise, la date de l’entretien, le poste et le contrat.
- Accepter uniquement des notes entières de 0 à 10 lorsqu’elles sont renseignées.
  Une note absente reste distincte de zéro, s’affiche « Non noté » et se classe
  après les notes renseignées.
- Conserver les deux notes manuelles : le feeling et les modifications du profil
  ne recalculent jamais les évaluations enregistrées.
- Garder chaque entretien indépendant, même pour une entreprise et un poste
  identiques.

## Stockage et interface

- Centraliser tous les accès à `localStorage` dans un seul service Angular.
- Versionner les données. Ne jamais écraser un contenu illisible ou d’une version
  inconnue, ni le considérer comme un stockage vide.
- Afficher les échecs de sauvegarde ; annoncer une réussite seulement après
  une écriture réussie.
- Demander confirmation avant suppression et effacer uniquement les données
  JobView.
- Afficher les saisies comme du texte et conserver les données métier dans le
  navigateur. Ne pas introduire de backend, de synchronisation ou d’IA en V1.

## Vérification

- Ajouter des tests `*.spec.ts` ciblés avec des données fictives pour les règles
  modifiées, notamment zéro versus absence de note et les erreurs de stockage.
- Exécuter `pnpm test` et `pnpm build` après une modification du code.
- Vérifier dans un navigateur les parcours concernés : affichage mobile,
  confirmation de suppression et persistance après réouverture.
