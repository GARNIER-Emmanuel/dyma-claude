# Phase 2 — plan d'implémentation

Statut : **plan retenu pour la demande « mets en place la phase 2 » du 18 octobre 2026**. Cette demande autorise son exécution, selon le même déroulement que la phase 1. Les choix sont annoncés avant l'implémentation.

Références : [spécification](spec.md), [tranche verticale](../../../tranche-verticale.md) et [consignes du dépôt](../../../AGENTS.md).

## Dépendance

La phase 1 est présente dans le commit `b27e875` ; sa gate locale est documentée comme validée. Les types `Profile`, `Interview` et les validations existantes ont été relus et seront réutilisés sans modification.

## Contrats retenus

- Un service Angular fourni à la racine expose `load()`, `saveProfile(profile)` et `addInterview(interview)`. Un token injecte un fournisseur de stockage pour les simulations, y compris un getter refusé.
- Une seule clé `jobview:data` contient `{ version: 1, profile: Profile | null, interviews: Interview[] }`. `null` signifie aucun profil enregistré. Aucune nouvelle contrainte métier de profil.
- Les notes absentes sont omises en JSON ; zéro reste zéro. Les identifiants non vides sont fournis par l'appelant ; un identifiant dupliqué est refusé sans dédupliquer entreprise/poste.
- Les lectures distinguent `empty`, `ready`, `invalid-data` (raison JSON illisible ou structure inexploitable), `unknown-version` et `access-denied`.
- Les sauvegardes distinguent `saved`, `blocked` (avec la lecture non sûre), `invalid-input`, `duplicate-id`, `quota-exceeded`, `access-denied` et `write-failed`. La future interface traduira ces résultats en français.
- Le contrôle JSON refuse les types incorrects, champs manquants, valeurs métier invalides, identifiants dupliqués et champs inconnus à tous les niveaux. Refuser les champs inconnus évite leur perte silencieuse lors d'une réécriture.
- Chaque sauvegarde relit le stockage puis préserve les autres données. Aucun cache ne remplace cette lecture ; un chargement vide n'écrit rien. Une réussite n'est retournée qu'après `setItem` réussi.

## Fichiers et étapes

1. `src/app/storage/storage-data.ts` : enveloppe, résultats discriminés et gardes de structure réutilisant les validations métier.
2. `src/app/storage/jobview-storage.ts` : service unique et token de simulation. L'obtention du stockage se fait dans un bloc protégé.
3. `src/app/storage/jobview-storage.spec.ts` : sauvegarde/relecture par une nouvelle instance, écritures successives, zéro/absence, indépendance et absence de mutation. Tests avec stockage simulé, plus intégration localStorage jsdom.
4. Tester les deux opérations après lecture non sûre : zéro tentative d'écriture et contenu exact conservé. Simuler aussi quota saturé, écriture refusée et erreur générique ; vérifier échec explicite, contenu antérieur intact et nouvelle tentative possible.
5. Consigner les sorties des commandes, les scénarios et la revue Git dans le dossier de phase ; actualiser son état.

## Hors périmètre

Interface utilisateur, suppression automatique, remise à zéro, migration, récupération, réseau et fonctionnalités reportées.

Le test jsdom vérifie l'intégration de l'API locale ; la fermeture/réouverture réelle du navigateur et la recette mobile restent prévues en phases 3 et 4, après création du parcours.

localStorage n'offre pas de transaction entre onglets : la relecture conserve les données déjà visibles, sans garantie pour des écritures simultanées entre plusieurs onglets. Aucune synchronisation n'est ajoutée.

## Validation à préparer

`pnpm test`, `pnpm build` et `pnpm exec tsc --project tsconfig.spec.json --noEmit`, avec assertions de conservation des données et d'absence d'écriture après lecture non sûre. Consigner les résultats dans [validation.md](validation.md).
