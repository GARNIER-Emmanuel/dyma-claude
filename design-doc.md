# JobView — conception

## But et périmètre

JobView est un site personnel pour conserver les informations de chaque entretien et comparer les propositions d’emploi. Deux espaces suffisent : **Mon profil** et **Mes entretiens**.

La V1 fonctionne sans compte, backend ni base distante. Les données restent dans le navigateur ; mobile et PC ont des données indépendantes. Synchronisation, partage, import de CV, IA, scores calculés, export, sauvegarde et PWA sont exclus. Le fonctionnement hors connexion n’est pas garanti.

## Fonctionnalités et règles

Le profil contient les compétences, le métier recherché, la fourchette de salaire souhaitée, les horaires, le télétravail, la localisation et le contrat recherché. Il sert d’aide-mémoire : le modifier ne change aucune évaluation enregistrée.

Chaque entretien est indépendant, même pour une entreprise et un poste déjà rencontrés. Il peut être créé, consulté, modifié et supprimé.

| Données d’un entretien | Règle |
|---|---|
| Entreprise, date de l’entretien, poste, contrat | Obligatoires. |
| Mission, compte rendu, outils, avantages et primes | Facultatifs. |
| Salaire | Facultatif, en brut annuel en euros. |
| Horaires | Facultatifs, plage hebdomadaire en texte libre. |
| Télétravail et localisation | Facultatifs ; un seul champ de localisation. |
| Performance des conditions et compatibilité | Deux notes manuelles facultatives, entières de 0 à 10. |
| Feeling | Facultatif : « Super bon », « OK », « Pas top ». Ne modifie jamais les notes. |

La liste utilise un tableau avec tri par date ou par l’une des notes, recherche entreprise/poste et filtres feeling, contrat et télétravail. Une note absente est affichée « Non noté » et placée après les notes renseignées ; elle ne vaut pas zéro.

L’interface est responsive. Sur mobile, le tableau présente les informations essentielles et donne accès au détail. La suppression d’un entretien et l’effacement de toutes les données JobView demandent confirmation.

## Réalisation simple

Une seule application Angular, avec pnpm, sans monorepo ni CLI. Les versions retenues sont Node.js 24.18.1 (minimum 24.15, branche 24), Angular et Angular CLI 22.2.3, TypeScript 6.0.3, RxJS 7.8.2 et pnpm 10.15.1. Les dépendances sont fixées dans `package.json` et verrouillées dans `pnpm-lock.yaml`.

Les fichiers sont organisés dans `src/app/` selon les besoins : composants pour les écrans, types et fonctions pour les règles métier, un service Angular pour le stockage. Il n’est pas nécessaire d’ajouter des packages partagés, des couches supplémentaires ou des interfaces sans besoin concret.

Le rangement suit les fonctionnalités :

- `profile/` : composants, types et règles propres au profil.
- `interviews/` : liste, formulaire, détail, types et validations des entretiens.
- `storage/` : service Angular unique de persistance et format de stockage versionné.

Les tests sont placés près des fichiers concernés. Les fichiers de démarrage et de configuration restent à la racine de `src/app/`. Ces dossiers sont créés au fil des besoins, sans dossiers vides anticipés.

Toutes les lectures, écritures et suppressions localStorage passent par ce service unique. Le format des données est versionné. Une lecture illisible ou une version inconnue ne doit jamais être traitée comme un stockage vide, ni conduire à écraser les données existantes. Un échec de sauvegarde est visible et n’est jamais annoncé comme une réussite.

Les textes saisis sont affichés comme du texte, jamais comme du HTML exécutable. Aucune donnée métier ne quitte le navigateur et aucun contenu personnel réel n’est ajouté au dépôt ou aux tests. L’effacement cible uniquement les données JobView.

Le site est compilé en fichiers statiques pour Vercel Hobby. Une adresse stable est conservée, car les données dépendent de l’origine du site. Sans export ni sauvegarde, leur perte ne permet pas de récupération ; cette limite est acceptée pour la V1.

## Prochaine étape et checklist

Construire d’abord un parcours complet : renseigner le profil, enregistrer un entretien avec les quatre champs obligatoires et les évaluations, puis retrouver les mêmes données après fermeture et réouverture du navigateur à la même adresse. Compléter ensuite les tris et filtres.

- [ ] Le profil et un entretien persistent après fermeture et réouverture du navigateur.
- [ ] Les champs obligatoires, les notes de 0 à 10, les notes absentes, la modification, les tris et chaque filtre sont vérifiés avec des données fictives.
- [ ] Des tests ciblés couvrent un stockage refusé, saturé, illisible ou d’une version inconnue, sans écrasement des données existantes et avec une erreur visible.
- [ ] L’inspection réseau confirme qu’aucune donnée métier n’est transmise ; les suppressions demandent confirmation et l’effacement retire uniquement les données JobView.
- [ ] Le parcours fonctionne sur mobile et PC à l’adresse Vercel stable, avec des données indépendantes.
- [ ] La licence est choisie avant diffusion.
