
# Checklist d'audit

Sélectionner les points applicables à la stack et au périmètre. Un élément absent n'est pas automatiquement un défaut : justifier son utilité par un besoin concret.

## Contexte et structure

- Les responsabilités des fichiers et modules sont-elles compréhensibles ?
- Les conventions et décisions du projet sont-elles respectées ?
- Une duplication ou une dépendance complique-t-elle réellement la maintenance ?

## Comportement et fiabilité

- Les entrées et cas limites pertinents sont-ils traités ?
- Les erreurs sont-elles propagées ou présentées de manière adaptée ?
- Les accès aux données et les transitions d'état respectent-ils les règles documentées ?

## Vérification

- Les tests disponibles couvrent-ils les comportements importants et leurs erreurs ?
- Les instructions de lancement et de vérification sont-elles cohérentes avec la configuration ?
- Les preuves observées permettent-elles de distinguer un défaut confirmé d'une hypothèse ?

## Selon le type de projet

- Interface : états vides et d'erreur, accessibilité, adaptation des écrans, séparation de l'affichage et de la logique.
- API ou service : contrats, validation, autorisations et gestion des erreurs.
- Traitement ou outil : formats d'entrée et de sortie, erreurs, reproductibilité et effets de bord.
- Stockage : cohérence, gestion des échecs, migrations et protection des données selon les besoins réels.

Examiner seulement le code et la configuration autorisés. Ne pas lire de secrets ou de données personnelles réelles pour vérifier ces points. Cet audit rapide reste limité à l'échantillon lu.
