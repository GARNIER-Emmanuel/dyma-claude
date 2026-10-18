---
name: audit-express
description: Analyse rapidement un projet de code pour identifier sa stack et proposer des améliorations.
---

# Audit express

Quand ce Skill est utilisé :

1. Exécute `scripts/inspecter-projet.mjs`
   depuis la racine du projet avec Node.js.
   Utilise le chemin réel du script dans ce Skill.
2. Lis `references/checklist.md`.
3. Examine quelques fichiers importants du projet.
4. Donne les 3 améliorations les plus utiles.

## Format de réponse

- Stack détectée
- 3 améliorations avec justification
- Fichiers concernés

Ne modifie aucun fichier.
