# Règles de l’application JobView

Ces consignes concernent `src/app/` et ses sous-dossiers. Elles complètent
`AGENTS.md` à la racine. Respecter le périmètre de la V1 dans `design-doc.md`
et les limites du parcours retenu dans `tranche-verticale.md`.

## Organisation des fichiers

- Organiser les fonctionnalités dans `profile/` et `interviews/`.
- Conserver le service unique `JobViewStorage` et le format versionné dans `storage/`.
- Conserver les composants, types, validations et tests près de leur fonctionnalité.
- Garder les fichiers de démarrage et de configuration à la racine de `src/app/`.
- Réutiliser ces dossiers ; créer un nouveau dossier seulement pour un besoin concret.

## Logique métier

- Écrire les validations comme des fonctions pures : mêmes
  entrées, mêmes résultats, sans modifier les données reçues.
- Ces fonctions ne doivent accéder ni au stockage, ni au réseau, ni au DOM.
  Les composants gèrent l’affichage ; le service de stockage gère la persistance.
- Exiger l’entreprise, la date de l’entretien, le poste et le contrat.
- Accepter uniquement des notes entières de 0 à 10 lorsqu’elles sont renseignées.
  Une note absente reste distincte de zéro et s’affiche « Non noté ».
- Les tris et filtres sont reportés. Lors de leur implémentation autorisée,
  utiliser des fonctions pures et classer les notes absentes après les notes renseignées.
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
- La suppression et l’effacement global sont reportés. Lors de leur implémentation
  autorisée, demander confirmation et ne cibler que les données JobView.
- Afficher les saisies comme du texte et conserver les données métier dans le
  navigateur. Ne pas introduire de backend, de synchronisation ou d’IA en V1.

## Vérification

- Ajouter des tests `*.spec.ts` ciblés avec des données fictives pour les règles
  modifiées, notamment zéro versus absence de note et les erreurs de stockage.
- Exécuter `pnpm test` et `pnpm build` après une modification du code.
- Vérifier dans un navigateur les parcours concernés sur PC et mobile,
  ainsi que la persistance après réouverture lorsqu’elle est concernée.
  Vérifier la confirmation de suppression si ce parcours est ajouté.
