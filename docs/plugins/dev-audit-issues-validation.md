# Validation du plugin Dev — Audit et issues

Date : **21 octobre 2026**, fuseau Europe/Paris.

- Branche : `codex/jobview-audit-issues-plugin`.
- Commit de base : `b7faa05` ; fichiers locaux non commités.
- Périmètre : `dev-audit-issues/` et `.agents/plugins/marketplace.json`.
- Travail préexistant : `.agents/worktrees/` conservé ; skills du cours inchangés.

## Correction de la version initiale

Le paquet `jobview-audit-issues` a été renommé `dev-audit-issues`, version **0.2.0**. Les références au projet, à ses phases, à ses documents et à son rédacteur configuré ont été retirées. La checklist couvre des critères communs et des points conditionnels selon la cible. Le script de détection Node.js a été supprimé : l'identification de la stack repose sur la lecture des fichiers. Le guide explique la réutilisation sur un autre projet.

Ce compte rendu reste dans la documentation du cours, hors du paquet réutilisable.

## Contrôles locaux réussis

- JSON : manifeste et catalogue lisibles ; identité, version et chemin de source cohérents ; installation facultative et sous-titre inférieur ou égal à 30 caractères.
- YAML : deux frontmatters et deux métadonnées analysés comme données avec un parseur restreint aux chaînes, booléens et mappings à deux niveaux utilisés ; invocation explicite conservée.
- Les références relatives des skills restent dans le paquet et existent ; les trois exemples d'issues restent inchangés.
- Aucun ancien identifiant, nom de projet, chemin personnel, rôle d'agent particulier ou référence au script supprimé dans les instructions des skills. Le README contient le chemin local du catalogue du cours pour l'installation par commande.
- Aucun script exécutable, dépendance à un runtime ou lien symbolique dans le paquet ; fichiers UTF-8 et fins de fichiers vérifiées.
- Aucun fichier suivi existant modifié ; catalogue mis à jour et travail préexistant préservé.

## Non vérifié

- Validation exhaustive contre les schémas distants et validation YAML générale hors du sous-ensemble utilisé.
- Installation et chargement dans Codex ; exécution des skills après installation.
- Recette du plugin sur un second projet réel ; la structure et les instructions ont été vérifiées localement.
- Connexion GitHub et lecture d'issues distantes ; aucune publication réalisée.
- Compatibilité Claude Code.

Les anciens essais du script de détection concernaient la version initiale : ils ne sont pas une preuve de comportement pour la version 0.2.0. Aucun test ni compilation de l'application n'a été exécuté, car aucun code applicatif n'a changé.
