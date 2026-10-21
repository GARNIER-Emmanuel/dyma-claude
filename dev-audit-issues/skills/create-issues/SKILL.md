---
name: create-issues
description: "Rédiger en français un brouillon d'issue GitHub à partir d'un besoin ou de constats d'audit vérifiés, sans publication ni modification de fichiers."
---

# Préparer une issue

## Périmètre

Produire des brouillons dans la conversation. Ne modifier aucun fichier et ne créer, commenter, modifier ou clôturer aucune issue GitHub. Ne pas commiter, pousser ni implémenter la solution. Une éventuelle publication explicitement demandée relève d'une étape distincte, exécutée avec les outils GitHub disponibles et les consignes du dépôt ; ne jamais présenter un brouillon comme publié.

## Préparer le brief

1. Lire les consignes applicables et les références utiles au besoin. Si le dépôt est accessible, relever son état Git et vérifier les fichiers cités. Consulter la documentation, les décisions et les preuves pertinentes lorsqu'elles existent, sans imposer de noms de fichiers ou de processus au projet. Une issue rédigée ne vaut pas autorisation d'implémenter.
2. Pour une issue existante, lire l'issue et ses commentaires avec les outils GitHub disponibles et autorisés, en respectant les préférences du dépôt. Rechercher les doublons pertinents lorsque cet accès est disponible. Sinon, préciser ce qui n'a pas été vérifié et poursuivre seulement le brouillon permis par les faits fournis ou observés localement. Aucune connexion GitHub n'est requise pour rédiger un brouillon ; ne pas inventer de contenu distant ni tenter de publication.
3. Si le besoin vient d'`audit-express`, reprendre uniquement les constats sélectionnés ou couverts par la demande. Conserver leurs identifiants, preuves et limites ; ne pas transformer une hypothèse en bug confirmé. Regrouper les constats de même cause, séparer les objectifs indépendants seulement si plusieurs brouillons sont demandés.
4. Préparer un brief court : faits sourcés, objectif, décisions acquises, actions, critères d'acceptation, exclusions et informations manquantes. Demander un arbitrage seulement si l'ambiguïté empêche de définir le périmètre ; sinon présenter un brouillon avec les questions restantes.

## Rédiger

- Respecter d'abord le format explicitement demandé, sinon le modèle d'issue applicable du dépôt, sinon le format par défaut ci-dessous.
- Une issue existante sert de référence de contenu sans imposer son format.
- Lire uniquement l'exemple utile : [bug](references/bug.md), [fonctionnalité](references/feature.md) ou [amélioration technique](references/technical.md). Remplacer les exemples génériques par des critères adaptés.
- Rédiger directement : le plugin ne dépend d'aucun modèle, rôle d'agent ou configuration personnelle.

## Format par défaut

Un titre court, puis ces quatre rubriques, dans cet ordre :

### Contexte

Le problème ou le besoin et ses preuves. Pour un bug, préciser les étapes de reproduction et les comportements constaté et attendu ; identifier les étapes non exécutées comme telles.

### Objectif

Le résultat attendu et le périmètre. Intégrer les dépendances et prérequis connus sans inventer de décision.

### Travail à réaliser

Une liste courte d'actions nécessaires, avec les contraintes et les vérifications pertinentes.

### Critères d'acceptation

Une liste à cocher de résultats concrets et vérifiables. Un test proposé reste à exécuter ; ne pas déclarer qu'il est réussi.

Ajouter uniquement les rubriques facultatives « Hors périmètre » et « Références », après les critères, si elles apportent une information utile. Ne pas supprimer, renommer ou réordonner les quatre rubriques principales du format par défaut.

## Relire et présenter

Vérifier la fidélité au brief, le format applicable, les critères vérifiables et l'absence d'inventions. Corriger les écarts mineurs puis présenter le brouillon dans la conversation, suivi séparément des informations manquantes et des limites de vérification. Ne pas annoncer une recherche de doublons, une lecture GitHub ou un contrôle technique qui n'a pas eu lieu.
