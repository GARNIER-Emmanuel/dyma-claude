---
name: create-issues
description: Rédiger des issues GitHub claires et concises à partir d’un besoin, d’un bug ou d’une amélioration.
---

## Analyse et délégation

Instructions pour le principal ; le rédacteur suit celles de son fichier d’agent.

1. Analyser le besoin et ses références selon les consignes du dépôt. Pour une issue existante, lire aussi ses commentaires via le MCP GitHub ; signaler toute lecture non vérifiée.
2. Préparer un brief court : faits sourcés, objectif, décisions, actions, critères d’acceptation, exclusions et informations manquantes.
3. Déterminer le format applicable selon les règles ci-dessous.
4. Créer un seul sous-agent [redacteur-issue-econome](../../../.codex/agents/redacteur-issue-econome.toml), dont le TOML définit le modèle, l’effort et les consignes de rédaction. S’il est indisponible, le signaler et arrêter la délégation, sans remplacement.
5. Limiter le message de mission au brief et au format applicable. Ne pas copier l’historique (`fork_turns="none"` si disponible) ; les autres instructions de session restent applicables.

## Choix du format

- Respecter d’abord le format explicitement demandé par l’utilisateur, sinon le modèle d’issue applicable du dépôt, sinon le format par défaut ci-dessous.
- Une issue existante peut servir de référence pour le contenu, sans imposer son format.
- Consulter uniquement la référence utile : [bug](references/bug.md), [fonctionnalité](references/feature.md) ou [amélioration technique](references/technical.md). Ces exemples guident le contenu sans remplacer le format retenu.

## Format par défaut

Les règles de cette section et les adaptations suivantes s’appliquent uniquement au format par défaut.

Le brouillon contient un titre court, puis ces quatre rubriques principales, dans cet ordre :

### Contexte

Décrire le problème constaté ou le besoin à couvrir.

### Objectif

Préciser le résultat attendu et le périmètre de l’issue.

### Travail à réaliser

Présenter une liste courte des actions nécessaires.

### Critères d’acceptation

Présenter une liste à cocher de résultats concrets et vérifiables.

## Adaptations du format par défaut

- Adapter le contenu et sa longueur au besoin.
- Conserver les quatre rubriques : ne pas les supprimer, les renommer ou les réordonner.
- Ajouter uniquement les rubriques facultatives « Hors périmètre » et « Références », après les critères d’acceptation, lorsqu’elles sont utiles.
- Intégrer les prérequis, dépendances et informations manquantes dans les rubriques existantes.
- Pour un bug, préciser la reproduction et les comportements constaté et attendu dans « Contexte ».

## Vérification avant présentation

Le principal vérifie le format applicable, la fidélité au brief, les critères vérifiables et l’absence d’inventions. Corriger directement les écarts mineurs, puis présenter le brouillon et les questions restantes dans la conversation.

Ce skill produit uniquement un brouillon : aucune modification de fichier ni publication GitHub.
