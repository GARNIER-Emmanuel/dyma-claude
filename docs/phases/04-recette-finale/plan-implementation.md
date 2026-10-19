# Phase 4 — plan détaillé de recette finale

Statut : **plan approuvé le 19 octobre 2026 par le message utilisateur « commit puis implemente » ; exécution de la recette autorisée après le commit documentaire**.

Références : [issue #5](https://github.com/GARNIER-Emmanuel/dyma-claude/issues/5), [spécification](spec.md), [tranche verticale](../../../tranche-verticale.md), [conception](../../../design-doc.md), [consignes du dépôt](../../../AGENTS.md) et [consignes applicatives](../../../src/app/AGENTS.md).

## État vérifié et autorisation

- Issue #5 ouverte et commentaires lus via le MCP GitHub : aucun commentaire. L'issue #4 est supprimée (réponse GitHub 410) ; l'utilisateur a confirmé que la demande concerne #5.
- Dépôt propre au départ, branche `codex/phase-3-interface-angular`, HEAD `e66e4d9366a172796db01e99a92ce2b784dbd623`. Branche de travail créée depuis cet état : `codex/phase-4-recette-finale`.
- Changement externe observé pendant la préparation : HEAD avancé à `7c78db41f14151b7ee4e6d14500e11aca714ecda`, contenant ce plan et une mise à jour de clôture de phase 3 ; suivi de `origin/codex/phase-4-recette-finale` présent. Changements conservés. Aucun changement applicatif dans ce commit ; aucun accord de recette déduit de ce commit.
- Validations et preuves des phases 1 à 3 relues : 108, 270 puis 319 tests réussis et compilations réussies. La phase 3 documente 13 scénarios Chromium avec mobile émulé. Ces preuves historiques ne remplacent aucun contrôle final.
- Le code et les preuves de phase 3 figurent dans `11c2724`. Aucun diff entre ce commit et HEAD dans `src/`, `package.json`, `pnpm-lock.yaml` ou `angular.json`. Actualiser les mentions « non commitée » dans la validation de phase 3 et l'index, sans réécrire les preuves historiques.
- Les trois gates préalables sont documentées comme validées. Les mentions de prérequis non validés en phase 4 étaient obsolètes. Fermeture complète/réouverture et inspection réseau restent à effectuer.
- Le message utilisateur « commit puis implemente », reçu après présentation du plan détaillé, approuve ce plan et autorise le commit des documents avant exécution. Les corrections applicatives éventuelles restent soumises à accord selon l'issue.

## Périmètre et exclusions

Recette locale du parcours existant : profil, création sans profil préalable, liste/détail, notes, erreurs, persistance réelle, mobile et réseau. Les règles restent celles des références ci-dessus. Aucune évolution fonctionnelle, dépendance nouvelle ou modification applicative prévue. Versions, verrou et `.npmrc` conservés.

Vercel, hors connexion, synchronisation, tris/filtres, modification/suppression d'entretiens et effacement global sont exclus. Toute anomalie sera décrite avec sa correction proposée et soumise à accord avant modification de l'application.

## Environnement et prérequis techniques

- Windows/PowerShell, Node.js **24.18.1** vérifié ; pnpm attendu **10.15.1**.
- `pnpm --version` échoue actuellement avant démarrage : `EPERM` dans le cache Corepack utilisateur. La tentative hors bac à sable ne démarre pas (`setup refresh had errors`). Version pnpm actuelle **non vérifiée**. Résoudre cet accès dans le cadre des autorisations disponibles avant les commandes finales ; conserver les versions et protections du poste. Si le problème persiste, consigner le blocage et laisser la gate non validée.
- Serveur : `pnpm dev --host 127.0.0.1 --port 4200`, maintenu pendant la fermeture/réouverture. Origine unique : `http://127.0.0.1:4200/`. Ne pas changer d'hôte, port ou protocole. Si le port est occupé, identifier le service sans arrêter un service utilisateur sans accord.
- Chromium piloté par Playwright ; relever sa version réelle. Réutiliser le runtime disponible de phase 3 ; aucune installation de navigateur prévue. Si indisponible, signaler le blocage.
- PC **1440 × 900**, mobile émulé **390 × 844** et **320 × 740**, en pixels CSS ; réduction des animations activée. Consigner viewport, mode tactile et user-agent effectifs. L'émulation ne vaut pas un essai sur téléphone physique.
- Profils persistants exclusivement dédiés sous `.angular/jobview-phase4/chromium-pc/`, `chromium-mobile-390/` et `chromium-mobile-320/`, dossier déjà ignoré par Git. Vérifier qu'ils sont neufs avant premier lancement ; sinon choisir un nouveau suffixe sans effacer le contenu existant. Aucun profil personnel utilisé.

## Données exclusivement fictives

| Objet | Valeurs |
|---|---|
| Profil P1 | Compétences `Angular fictif` et `Java fictif` sur deux lignes ; métier `Développeur recette JV-P4` ; salaire `40–45 k€ fictifs` ; horaires `35 h fictives` ; télétravail `Deux jours fictifs` ; localisation `Ville fictive JV-P4` ; contrat `CDI fictif` |
| Profil P2 | P1 avec métier `Autre métier fictif JV-P4` et télétravail `Trois jours fictifs` |
| Entretien A | Entreprise `Entreprise fictive JV-P4` ; date `19/10/2026` ; poste `Poste fictif JV-P4` ; contrat `CDI fictif` ; conditions `0` ; compatibilité vide ; feeling `OK` |
| Entretien B | Mêmes entreprise, date, poste et contrat ; conditions `0`, compatibilité vide, feeling `Pas top`, identifiant généré distinct |
| Invalides | Champs requis vides ; date `31/02/2026` ; notes `-1`, `11`, `2.5` |
| Brouillon en échec | Entreprise `Sauvegarde fictive refusée JV-P4`, autres champs valides ; modification fictive du profil également testée |

Préfixer entreprises/métiers par `PC`, `M390` ou `M320` selon le profil de recette. Les données de référence sont relevées après sauvegarde réelle par l'interface, jamais injectées pour remplacer le parcours.

## Scénarios après approbation

Effectuer S1 à S7 aux trois tailles dans leurs profils dédiés. Toute étape dépendant d'une étape échouée reste non vérifiée avec la cause.

| ID | Actions | Attendu et preuve |
|---|---|---|
| S1 — Sans profil, liste et détail | Sur stockage neuf, constater l'état vide ; créer A sans profil, ouvrir liste et détail. | Profil `null`, un entretien, champs exacts ; `0 / 10` et `Non noté` visibles dans liste/détail ; zéro stocké et compatibilité absente du JSON ; captures et relevé JSON. |
| S2 — Profil et indépendance | Saisir/enregistrer P1 puis P2 ; créer B après avoir changé son feeling de `OK` à `Pas top` sans toucher aux notes. | Sept informations du profil retrouvées ; A strictement inchangé après chaque sauvegarde ; B avec identifiant distinct et notes inchangées malgré le feeling ; relevés avant/après. |
| S3 — Saisie invalide | Soumettre vide, puis date impossible et chacune des notes invalides dans les deux champs de note ; comparer le stockage avant/après chaque refus. | Erreurs françaises visibles, champs accessibles, aucune sauvegarde ni fausse confirmation, stockage strictement identique ; capture et assertions. |
| S4 — Échec de sauvegarde | Avec P2, A et B sauvegardés, simuler quota dépassé ; tenter ajout d'entretien et modification de profil ; lever la panne et réessayer l'ajout. | Erreur visible, saisie conservée, aucune fausse réussite ni donnée présentée comme enregistrée ; stockage précédent intact ; nouvelle tentative réussie sans doublon. |
| S5 — Réouverture complète | Relever profil, entretiens et chaîne stockée ; fermer entièrement le navigateur dédié ; constater sa déconnexion ; relancer un nouveau navigateur avec le même dossier, origine et serveur actif ; consulter profil, liste et chaque détail. | Données exactes retrouvées via l'interface et comparaison du stockage ; preuves horodatées de fermeture et nouveau lancement, chemin de profil identique ; aucune réinjection des données. |
| S6 — Ergonomie | Parcourir les écrans aux trois tailles ; parcours Tab/Entrée sur PC ; vérifier focus, actions et largeur du document. | Actions accessibles, messages lisibles, aucun débordement horizontal ; captures pleine page inspectées visuellement et limites d'émulation documentées. |
| S7 — Réseau | Observer les transports pendant S1 à S6 : fenêtres horodatées de saisie, sauvegarde et consultation, avant/après réouverture. | Aucun contenu métier transmis ; relevé des transports et conclusion bornée à l'observation. |

### Simulation et restauration

Sauvegarder `Storage.prototype.setItem`, installer temporairement un remplacement lançant `DOMException(..., 'QuotaExceededError')` uniquement pour `jobview:data`, puis restaurer dans un bloc de nettoyage même si le scénario échoue. Compter les tentatives et comparer la chaîne stockée avant/après. Ne pas saturer réellement le disque ou le stockage. Lever la panne avant S5 ; aucun script de simulation réinjecté au redémarrage.

### Preuve de fermeture complète

Utiliser un lancement Chromium avec profil persistant dédié. Fermer ce lancement, attendre sa fermeture effective et enregistrer la déconnexion du navigateur ; fermer son contexte persistant doit fermer ce navigateur dédié. Relancer un nouveau lancement depuis le même dossier. Relever heures, version, mode de lancement, dossier, origine et disponibilité du serveur avant/après. Ne pas fermer le navigateur personnel ni le navigateur partagé du MCP. Un rechargement, un nouvel onglet ou la seule fermeture d'un contexte non persistant ne suffisent pas. Si le runtime ne permet pas de prouver l'arrêt complet, S5 reste non vérifié et bloque la gate.

### Inspection réseau

Installer l'observation avant la première navigation et avant celle du second lancement. Relever toutes les requêtes HTTP(S) : URL, méthode, type de ressource, corps émis, statut, échec éventuel ; inspecter aussi les frames WebSocket sortantes. Couvrir notamment fetch/XHR, formulaires, navigations, ressources et beacons visibles au niveau navigateur. Ne pas bloquer le réseau pendant ce contrôle.

Marquer les étapes du parcours ; rechercher les marqueurs fictifs dans URL, corps, frames et représentations encodées. Examiner également destinations/contenus pour détecter une transmission partielle sans marqueur complet. Distinguer les connexions au serveur de développement (dont HMR) mais inspecter leurs contenus également. Toute transmission métier est bloquante. La conclusion se limite aux transports, scénarios et périodes observés ; aucune garantie générale de confidentialité n'est déduite.

## Exécution et fichiers prévus

1. Obtenir et consigner l'approbation explicite du plan, résoudre les prérequis et relever à nouveau branche, HEAD, diff et versions.
2. Préparer le pilote et les profils neufs ; démarrer le serveur stable ; exécuter les scénarios, collecter assertions, erreurs JavaScript, captures et réseau ; inspecter les captures utiles.
3. Restaurer les simulations, fermer les navigateurs dédiés et arrêter uniquement le serveur lancé pour cette recette après les contrôles. Consigner les profils fictifs laissés dans le cache ignoré ; ne pas commiter ces profils.
4. En cas d'anomalie, présenter gravité, scénario/fichier, preuve, correction proposée et contrôles à refaire ; attendre l'accord avant correction applicative. Après toute correction autorisée, refaire les scénarios impactés.
5. Exécuter **`pnpm test` et `pnpm build` sur le même état final des sources**, avec sorties complètes et codes de sortie. Les 319 tests de phase 3 restent une référence historique, pas un résultat actuel.
6. Compléter [validation.md](validation.md), revoir le diff et `git diff --check`. Ne valider la gate que si tous les contrôles obligatoires sont réussis.

Fichiers prévus une fois le plan approuvé :

- Ce plan et `validation.md` : approbation, contrôles, preuves et conclusion.
- `docs/phases/04-recette-finale/preuves/recette-navigateur.js` : pilote reproductible utilisant le runtime disponible, sans nouvelle dépendance ou suite Playwright applicative.
- Dans ce même dossier `preuves/` : `recette-navigateur.md`, `resultats-navigateur.json`, `reseau.json`, `reouverture.json`, `tests-complets.txt`, `compilation.txt` et captures `pc-*.png`, `mobile-390-*.png`, `mobile-320-*.png`. Données fictives et preuves utiles uniquement ; aucun profil Chromium brut.
- `docs/phases/03-interface-angular/validation.md` et `docs/phases/README.md` : mentions obsolètes et état courant des phases ; preuves historiques préservées.

## Gate et autorisations

Chaque résultat doit distinguer attendu, observé, preuve et statut **réussi / échoué / non vérifié**, avec date, environnement et état des sources. Tout contrôle obligatoire absent ou échoué bloque la gate.

La préparation ne modifie que ce plan, les validations de phases 3/4 et l'index. Aucun script de recette ou résultat final créé avant approbation. Commentaire GitHub, commit, push et clôture nécessitent une autorisation explicite distincte.
