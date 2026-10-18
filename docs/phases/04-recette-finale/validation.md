# Phase 4 — validation et preuves

Statut : **non vérifié**. Aucune gate n'est déclarée réussie par la création de ce document.

Références : [spécification](spec.md) et [plan](plan-implementation.md).

## Contrôles obligatoires

- [ ] Les gates de phases 1 à 3 sont validées et le plan de recette est approuvé.
- [ ] Le profil et l'entretien sont retrouvés après fermeture complète et réouverture du navigateur à la même origine et dans le même profil.
- [ ] La création sans profil, la liste et la consultation sont vérifiées.
- [ ] L'absence de note, zéro et l'indépendance des évaluations sont vérifiés.
- [ ] La saisie invalide est refusée avec une erreur visible.
- [ ] Un échec de sauvegarde maîtrisé est observé sans perte de données ni fausse confirmation.
- [ ] Le parcours mobile et PC est vérifié avec les preuves nécessaires.
- [ ] L'inspection réseau pendant les scénarios ne révèle aucune transmission de données métier.
- [ ] L'adresse locale, le navigateur, le profil de navigation et l'environnement sont consignés.
- [ ] `pnpm test` réussit sur le code de la phase, avec une sortie conservée.
- [ ] `pnpm build` réussit sur le même état du code, avec une sortie conservée.
- [ ] La revue Git confirme le respect du périmètre, l'absence de fonctionnalités anticipées et de dépendances inutiles, et les tests des cas limites.

## Environnement et état du code

À renseigner lors des vérifications : date, branche et commit ou état des modifications, versions Node/pnpm, commandes exactes, et navigateur/adresse/tailles d'écran si concernés.

## Résultats

| Contrôle ou scénario | Résultat attendu | Résultat observé | Preuve | Statut |
|---|---|---|---|---|
| Tests unitaires | Réussite des tests pertinents et existants | Non exécutés dans le cadre de cet ajout documentaire | Aucune | Non vérifié |
| Compilation | Compilation réussie | Non exécutée dans le cadre de cet ajout documentaire | Aucune | Non vérifié |
| Autres contrôles de la phase | Critères de la spécification respectés | À renseigner scénario par scénario | Aucune | Non vérifié |

Remplacer ou compléter ces lignes au fil des contrôles. Ne pas confondre un résultat attendu, une observation réelle et une preuve. Une vérification obligatoire absente reste non vérifiée et bloque la gate.

## Anomalies et revue

Aucune revue de code implémenté n'a été réalisée pour cette phase. Pour chaque anomalie constatée, indiquer la gravité, le fichier ou scénario concerné, le problème, la correction proposée et les contrôles à refaire. Ne pas annoncer l'absence d'anomalie avant vérification.

## Conclusion

**Gate validée : NON.**

Motif actuel : phases préalables non validées, plan non approuvé et vérifications non réalisées.

Pour fermer la gate, satisfaire les contrôles obligatoires ci-dessus, consigner les résultats réels et leurs preuves, et résoudre les anomalies bloquantes. Ne pas inclure Vercel, le hors connexion ou la synchronisation entre appareils dans cette conclusion de recette locale.
