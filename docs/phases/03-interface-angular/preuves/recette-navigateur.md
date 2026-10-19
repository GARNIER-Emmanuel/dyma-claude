# Phase 3 — observations navigateur

- Date : 19 octobre 2026, exécution terminée à 21:38:23 Europe/Paris (19:38:23 UTC).
- État : branche `codex/phase-3-interface-angular`, HEAD `f75cb31`, implémentation locale non commitée. Même état applicatif que les commandes finales de tests/compilation/types.
- Serveur : `pnpm dev --host 127.0.0.1`, origine `http://127.0.0.1:4200/`.
- Navigateur : Chromium 155.0.8059.85 piloté par le MCP Playwright. Contextes séparés sans données personnelles ; contextes fermés après chaque scénario.
- Tailles : PC 1440 × 900, mobile émulé 390 × 844 et 320 × 740, en pixels CSS. Préférence de réduction des animations activée. Ce contrôle ne vaut pas essai sur téléphone physique.
- Script effectivement exécuté : [recette-navigateur.js](recette-navigateur.js), fonction transmise à `browser_run_code_unsafe` via son argument `filename`.
- Résultats bruts : [resultats-navigateur.json](resultats-navigateur.json). Les 13 scénarios sont **réussis**, aucune erreur `pageerror` relevée dans ces contextes.

| Scénario | Observation réelle | Capture | Statut |
|---|---|---|---|
| PC, état vide et création sans profil | État vide explicite ; quatre champs requis ; un entretien enregistré alors que `profile` vaut `null` | [État vide](pc-vide.png) | Réussi |
| Saisie invalide | Entreprise requise avec focus ; date 31/02 refusée et note 2.5 refusée ; aucune donnée écrite | [Erreurs de champs](pc-formulaire-invalide.png) | Réussi |
| Zéro, note absente, détail et liste | `conditionsRating: 0`, compatibilité absente du JSON ; « 0 / 10 » et « Non noté » visibles ; accès liste/détail | [Détail](pc-detail.png), [liste](pc-liste.png) | Réussi |
| Profil et indépendance | Sept informations enregistrées, profil modifié, anciennes évaluations inchangées ; deux entretiens de même entreprise/poste conservent des identifiants différents | [Profil](pc-profil.png) | Réussi |
| Brouillons et confirmations | Saisie conservée en navigation entre espaces ; ancienne confirmation effacée à la nouvelle saisie ; après rechargement, deux entretiens retrouvés | Script et résultats bruts | Réussi |
| Mobile 390 × 844 | Création, détail, liste, profil enregistré, ordre clavier des champs ; aucun débordement horizontal | [Formulaire](mobile-390-formulaire.png), [détail](mobile-390-detail.png), [liste](mobile-390-liste.png) | Réussi |
| Mobile 320 × 740 | Même parcours et contrôles de largeur réussis | [Formulaire](mobile-320-formulaire.png), [détail](mobile-320-detail.png), [liste](mobile-320-liste.png) | Réussi |
| JSON illisible, format invalide, version inconnue | Erreur visible, aucune fausse liste vide, sauvegarde désactivée, compteur d'écritures à zéro ; nouvelle lecture après réparation du seul jeu fictif, brouillon conservé | [JSON](erreur-invalid-json.png), [format](erreur-invalid-format.png), [version](erreur-unknown-version.png) | Réussi |
| Lecture refusée | Simulation de `SecurityError`, erreur visible, aucune écriture, nouvelle lecture possible avec saisie conservée | [Refus de lecture](erreur-read-denied.png) | Réussi |
| Écritures échouées | Simulations de `QuotaExceededError`, `SecurityError`, erreur générique : erreur visible, aucune fausse confirmation, stockage inchangé et brouillon conservé ; nouvelle tentative réussie après levée de la panne fictive | [Quota](echec-QuotaExceededError.png), [refus](echec-SecurityError.png), [erreur générique](echec-Error.png) | Réussi |
| HTML et textes longs | `<img src=x onerror=alert(1)>` visible littéralement, aucun élément image créé ; texte long sans débordement dans le détail et la liste à 320 px | [Texte long](mobile-texte-long.png) | Réussi |
| Parcours entièrement au clavier | Tab/Entrée pour ouvrir, saisir, enregistrer un entretien, revenir à la liste, ouvrir le détail, accéder au profil et l'enregistrer ; focus sur le titre du détail | [Profil au clavier](pc-clavier.png) | Réussi |
| Échec avec données antérieures | Profil et entretien fictifs préexistants conservés exactement après quota dépassé ; aucune fausse confirmation | [Données conservées](mobile-echec-donnees-conservees.png) | Réussi |

Les captures d'état vide PC, formulaire mobile 390, détail mobile 320 et quota PC ont été ouvertes pour inspection visuelle : structure, lisibilité, focus et messages cohérents avec les contrôles automatisés.

## Limites

La vérification des confirmations avant écriture est couverte plus précisément par TestBed : l'interface ne confirme rien pendant `setItem`, puis confirme après retour `saved`. Les simulations navigateur confirment les échecs sans faux succès et la nouvelle tentative réussie.

La recette utilise un rechargement de page, pas une fermeture complète du navigateur. Réouverture complète, inspection réseau finale, navigateur supplémentaire, téléphone physique, déploiement et Vercel : **non vérifiés**, hors de cette gate locale de phase 3. Aucune conformité générale d'accessibilité n'est déclarée. La phase 4 n'est pas commencée.
