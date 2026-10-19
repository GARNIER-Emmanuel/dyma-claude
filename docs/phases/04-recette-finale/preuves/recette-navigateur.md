# Phase 4 — recette locale du 19 octobre 2026

**Résultat : 21 scénarios réussis (S1 à S7 aux trois tailles), aucune erreur JavaScript applicative.** La fermeture complète et la réouverture ont été réalisées trois fois, dans trois profils dédiés indépendants. Aucun changement applicatif nécessaire.

## État du code et environnement

- Branche `codex/phase-4-recette-finale`, commit de référence `9ec7287` (plan approuvé et préparation documentaire committés avant exécution). Sources applicatives identiques à `11c2724` ; résultats et documentation finale réunis dans le présent commit de recette, sur autorisation « commit et cloture l'issue ». Aucun push effectué par cette intervention.
- Windows, PowerShell 7 ; Node.js **24.18.1**, pnpm **10.15.1**, Angular **22.2.3**, Vitest **5.0.0**, jsdom **30.0.0**.
- pnpm utilise le cache local existant via la variable de processus `COREPACK_HOME` pointant sur `.pnpm-store/corepack`, déjà ignoré. Aucune modification globale, de version, d'ACL, de `.npmrc` ou de configuration applicative. Le blocage Corepack de la préparation est résolu dans ce contexte local.
- Origine constante **http://127.0.0.1:4200/**. Un serveur JobView préexistant écoute au PID `50508` ; la tentative de démarrage s'arrête avec « Port 4200 is already in use ». Aucun serveur utilisateur arrêté. La lecture WMI de sa ligne de commande est refusée et la relance privilégiée échoue au démarrage de l'outil ; la correspondance avec le dépôt est établie par comparaison des 15 sources applicatives de la source map servie avec les fichiers locaux (normalisation CRLF/LF uniquement). Serveur disponible après chaque réouverture (HTTP 200).
- Navigateur **Chrome/Chromium 155.0.8059.85**, exécutable existant `C:/Program Files/Google/Chrome/Application/chrome.exe`, lancé en mode headless avec Playwright via le MCP. Les chemins Chromium par défaut du runtime sont absents : aucune installation effectuée, utilisation de Chrome déjà présent.
- PC **1440 × 900**, mobile émulé **390 × 844** et **320 × 740** pixels CSS. `isMobile` et `hasTouch` activés uniquement en mobile ; réduction des animations activée. User-agents et chemins des profils exacts dans les résultats JSON.
- Dernière exécution complète : **22:15:43 à 22:15:53 Europe/Paris**, soit `20:15:43` à `20:15:53 UTC`. Les heures des JSON sont en UTC.
- Pilote effectivement exécuté : [recette-navigateur.js](recette-navigateur.js), chargé par l'argument `filename` de `browser_run_code_unsafe`. Le seul ajout ultérieur au pilote masque le jeton de connexion Vite dans les preuves sauvegardées, après analyse des URL complètes ; mêmes valeurs masquées dans les JSON de cette exécution. Aucun comportement du parcours modifié après la recette.

## Résultats observés

La [vérification du serveur](verification-serveur.json) conserve la comparaison des 15 sources servies avec le dépôt local, réexécutée après la recette. Le serveur existant n'a pas été modifié.

| Scénario | Observation aux trois tailles | Preuves |
|---|---|---|
| S1 — Sans profil, liste/détail et notes | Stockage initial neuf ; entretien A sauvegardé avec profil `null`, notes `0` et absente conservées ; `0 / 10` et `Non noté` dans liste et détail. | [Résultats](resultats-navigateur.json), [liste PC](pc-liste.png), [détail 320](mobile-320-detail.png) |
| S2 — Profil et indépendance | Sept informations du profil sauvegardées, puis profil modifié ; entretien A strictement inchangé. Même entreprise/poste pour B, identifiant distinct ; feeling `Pas top` sans modification des notes. | Résultats, [profil PC](pc-profil.png) |
| S3 — Invalides | Quatre champs requis, date impossible et notes -1/11/2.5 dans les deux champs refusés ; erreurs françaises, focus sur premier champ requis, chaîne du stockage inchangée. | [Champs requis PC](pc-invalide-requis.png), [mobile 320](mobile-320-invalide-requis.png), résultats |
| S4 — Quota simulé | Deux tentatives échouées par profil (entretien et profil) ; erreur visible, saisies conservées et stockage strictement inchangé, aucune fausse confirmation. Méthode native restaurée dans `finally` ; ajout réessayé avec succès, trois identifiants distincts. | [Échec entretien PC](pc-echec-entretien.png), [échec profil 390](mobile-390-echec-profil.png), résultats |
| S5 — Fermeture complète | Arrêt du lancement Chromium dédié, événement `disconnected`, `isConnected: false`, nouveau lancement avec le même dossier sans réinjection de données. Stockage avant/après strictement identique, sept informations du profil et les trois entretiens consultés via l'interface. | [Réouvertures](reouverture.json), captures avant/après ci-dessous |
| S6 — Ergonomie | 49 mesures de largeur, aucun débordement horizontal. PC : navigation, création/sauvegarde d'un quatrième entretien, liste, détail et sauvegarde du profil via Tab/Entrée, focus vérifié. Mobile : parcours en émulation mobile avec capacité tactile déclarée et captures à deux largeurs. | [Clavier PC](pc-clavier.png), [formulaire 390](mobile-390-formulaire.png), résultats et inspection visuelle |
| S7 — Réseau | 30 requêtes par profil, soit 90 au total, toutes GET sans corps et HTTP 200 vers l'origine locale ; 6 WebSocket de développement, 6 messages reçus `{"type":"connected"}`, aucune frame sortante. Aucune donnée métier observée dans URL, corps ou frames. | [Relevé réseau](reseau.json), résultats |

Après la réouverture, les trois entretiens A, B et l'ajout réessayé sont retrouvés dans chaque profil. Le parcours clavier ajoute ensuite un quatrième entretien uniquement au profil PC ; les deux profils mobiles en conservent trois. La compétence reste la même après la sauvegarde au clavier.

## Preuves de fermeture/réouverture

| Profil | Déconnexion complète (Europe/Paris) | Réouverture et données relues | Captures |
|---|---|---|---|
| PC | 22:15:45.585 | 22:15:46.050, même chaîne stockée | [Avant liste](pc-avant-reouverture-liste.png), [après liste](pc-apres-reouverture-liste.png), [après profil](pc-apres-reouverture-profil.png) |
| Mobile 390 | 22:15:49.062 | 22:15:49.515, même chaîne stockée | [Avant liste](mobile-390-avant-reouverture-liste.png), [après liste](mobile-390-apres-reouverture-liste.png), [après profil](mobile-390-apres-reouverture-profil.png) |
| Mobile 320 | 22:15:52.237 | 22:15:52.733, même chaîne stockée | [Avant liste](mobile-320-avant-reouverture-liste.png), [après profil](mobile-320-apres-reouverture-profil.png), [après détail](mobile-320-apres-reouverture-detail.png) |

Les dossiers des deux lancements sont identiques pour chaque variante et distincts entre variantes, sous `.angular/jobview-phase4/`, avec le suffixe `2026-10-19T20-15-43-420Z`. Les profils sont neufs au départ. Aucun `storageState`, export/import ou script de préremplissage n'a été utilisé pour la réouverture. Le navigateur partagé du MCP et les profils personnels restent ouverts et intacts.

## Réseau : portée et lecture du relevé

Observation installée avant chaque navigation initiale, puis avant celle du second lancement. Les marqueurs horodatent notamment saisie, sauvegarde et consultation. Les requêtes correspondent au document, aux scripts/styles, aux dépendances Angular/Vite et aux composants du serveur de développement ; leurs paramètres désignent des chemins de composants et horodatages techniques. Les corps sont tous absents, les destinations restent locales. Les connexions WebSocket sont également locales, sans émission de données métier.

Les URL complètes ont été examinées avant masquage du seul jeton de connexion Vite dans les fichiers de preuve. Ce masquage évite de conserver ce jeton éphémère ; il ne masque aucune donnée métier observée. La conclusion concerne uniquement les pages/transports et périodes de cette recette, avec les données fictives saisies ; elle ne constitue pas une garantie générale de confidentialité.

## Inspection visuelle et limites

43 captures sont conservées. Huit captures ont été ouvertes et inspectées : liste PC après réouverture, échec d'entretien PC, profil au clavier PC, formulaire 390, échec de profil 390, détail et profil 320 après réouverture et champs requis 320. Textes et erreurs lisibles, notes distinctes, navigation/actions accessibles, focus visible et aucune superposition ou largeur excessive observée. Les champs texte longs peuvent défiler dans leur contrôle ; leur contenu complet est vérifié par les valeurs du formulaire.

Les premières tentatives ont révélé des erreurs du pilote : retour à la liste omis, attente insuffisante du rendu Angular, sélecteurs non uniques lorsque deux entretiens ont la même entreprise et pendant le parcours clavier. Pilote corrigé, puis S1 à S7 relancés intégralement aux trois tailles. [Diagnostic initial du pilote](diagnostic-pilote.json). Aucun de ces ajustements ne modifie le code applicatif ; aucun défaut applicatif bloquant observé lors de la dernière exécution.

Tous les navigateurs dédiés sont fermés ; les simulations sont restaurées. Les profils fictifs des essais et du contrôle de lancement restent dans `.angular/jobview-phase4/`, ignoré par Git ; aucun profil brut n'est livré. Le serveur préexistant est conservé. Aucun serveur propre à cette recette ne reste à arrêter.

Téléphone physique, autre moteur de navigateur, Vercel, hors connexion et synchronisation : **non vérifiés, hors périmètre de cette recette locale**. La concurrence entre onglets conserve la limite documentée en phase 2.
