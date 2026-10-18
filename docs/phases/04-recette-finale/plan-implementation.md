# Phase 4 — plan de recette à préparer

Statut : **cadrage documentaire uniquement ; plan détaillé non préparé et non approuvé**. Ce fichier réserve le support de travail de la phase et n'autorise aucune exécution.

Références : [spécification](spec.md), [tranche verticale](../../../tranche-verticale.md) et [consignes du dépôt](../../../AGENTS.md).

## Dépendance

Les gates de phases 1 à 3 doivent être validées. Le plan de recette sera établi sur le parcours réellement implémenté et ses limites constatées.

## Scénarios à détailler

- Enregistrer puis retrouver un profil.
- Créer et consulter un entretien sans profil préalable.
- Distinguer note absente et note zéro.
- Vérifier l'absence de modification des évaluations par le profil et le feeling.
- Refuser une saisie invalide avec une erreur visible.
- Simuler un échec de stockage de manière maîtrisée, sans perte des données existantes ni fausse confirmation.
- Fermer complètement puis rouvrir le navigateur dans le même profil et à la même origine ; un rechargement ne suffit pas.
- Vérifier l'interface sur mobile et PC.
- Inspecter le réseau pendant la saisie, la sauvegarde et la consultation.

## Préparation nécessaire

Fixer les données fictives, l'adresse locale stable, le navigateur, le profil de navigation, les tailles d'écran et la méthode de simulation des erreurs. Prévoir un serveur disponible à la réouverture et une méthode de collecte des preuves.

## Fichiers et preuves

Le présent plan et [validation.md](validation.md) accueilleront les scénarios détaillés et le compte rendu. Le besoin de captures ou d'autres fichiers de preuve sera précisé avant la recette, avec leurs chemins. Ne pas ajouter de données personnelles réelles.

## Validation à préparer

Exécuter `pnpm test` et `pnpm build`, puis réaliser les scénarios autorisés. Pour chacun, distinguer résultat attendu, résultat observé, preuve et statut réussi/échoué/non vérifié.

Une anomalie constatée sera présentée avec les modifications nécessaires et soumise à l'accord de l'utilisateur avant correction, conformément au protocole de recette fourni. Ne pas inclure le déploiement Vercel ou les fonctionnalités reportées.
