# Phase 2 — validation et preuves

Statut : **gate locale validée le 18 octobre 2026**.

Références : [spécification](spec.md) et [plan](plan-implementation.md).

## Contrôles obligatoires

- [x] La gate de phase 1 est documentée comme validée ; le lancement demandé par l'utilisateur autorise la phase 2 et ses choix annoncés avant implémentation.
- [x] Sauvegarde et relecture du profil et des entretiens, dont zéro et absence de note.
- [x] Conservation des données lors des écritures successives.
- [x] Distinction entre vide, valide, JSON illisible, format inexploitable, version inconnue et lecture refusée.
- [x] Aucune tentative d'écriture après une lecture non sûre, pour les deux opérations de sauvegarde.
- [x] Erreurs d'écriture et saturation remontées ; contenu persisté antérieur intact.
- [x] `pnpm test` réussi, sortie conservée.
- [x] `pnpm build` réussi sur le même état des sources, sortie conservée.
- [x] Vérification TypeScript réussie, sortie conservée.
- [x] Revue des sources et du diff : périmètre respecté, aucune dépendance ajoutée, cas limites couverts.

## Environnement et état du code

- Date : 18 octobre 2026, Europe/Paris ; commandes à 10 h 30.
- Dépôt : `C:\dev\Perso\Learn\dymacourse\dyma-claude`.
- Branche : `codex/phase-2-persistance-locale`, créée depuis `b27e875` (phase 1).
- État : modifications locales non commitées. Le dépôt était propre au démarrage.
- Versions vérifiées : Node 24.18.1, pnpm 10.15.1 ; Vitest 5.0.0 dans la sortie des tests.
- Sources ajoutées : `src/app/storage/storage-data.ts`, `jobview-storage.ts` et `jobview-storage.spec.ts`.
- Les trois commandes ci-dessous portent sur le même état final des sources.

## Résultats observés

| Contrôle | Résultat observé | Preuve | Statut |
|---|---|---|---|
| `pnpm test` | 270 tests réussis dans trois fichiers : 162 tests de stockage et 108 tests existants | [Sortie complète](preuves/tests-complets.txt) | Réussi |
| `pnpm build` | Compilation de production réussie ; sortie `dist/jobview` | [Compilation](preuves/compilation.txt) | Réussi |
| `pnpm exec tsc --project tsconfig.spec.json --noEmit` | Code de sortie 0, aucun diagnostic TypeScript | [Types](preuves/types.txt) | Réussi |
| Revue Git et recherche des accès au stockage | Les accès de production sont exclusivement dans le service ; aucun composant ou modèle de phase 1 modifié | Fichiers ci-dessus ; `git diff --check`, `git status --short`, recherche `rg` dans `src/app` | Réussi |

## Correspondance règles et scénarios

Les scénarios sont dans `src/app/storage/jobview-storage.spec.ts` et utilisent exclusivement des données fictives.

| Règle | Vérification observée |
|---|---|
| Stockage réellement vide | Seul `getItem` retournant `null` produit `empty` ; le chargement ne tente aucune initialisation. Chaîne vide ou espaces seuls : JSON illisible et sauvegarde bloquée. |
| Enveloppe versionnée | Clé unique `jobview:data`, version 1, profil éventuellement `null`, liste d'entretiens. Une nouvelle instance relit les données enregistrées. |
| Profil et entretiens conservés | Création sans profil, ajout du profil, second entretien puis modification du profil : données cumulées conservées, mêmes entreprise/poste autorisés avec des identifiants distincts. |
| Notes manuelles | Zéro est conservé ; propriété de note absente ou `undefined` omise en JSON. Les modifications du profil et le feeling ne recalculent aucune note. |
| Structure du JSON | Refus des types incorrects, champs manquants, dates impossibles, valeurs de notes/feeling invalides, identifiants vides/dupliqués et champs inconnus. Aucun sauvetage partiel ni remplacement. |
| Lecture non sûre | Pour chaque document illisible/inexploitable et version inconnue, les deux sauvegardes retournent `blocked`, `setItem` n'est jamais appelé et la chaîne initiale reste strictement identique. |
| Accès refusé | Échec de `getItem`, du getter localStorage ou stockage absent : résultat explicite ; aucune réussite. Une nouvelle tentative après rétablissement de l'accès peut aboutir. |
| Écriture échouée | Quota, SecurityError et erreur générique testés pour les deux opérations, avec et sans données préalables. Une seule tentative, résultat d'échec, état complet du stockage inchangé, relecture inchangée et nouvelle tentative réussie. |
| Données fraîches | Un état vide ou valide lu auparavant ne remplace pas une nouvelle lecture : données ajoutées entre-temps conservées, contenu devenu illisible bloqué. |
| Entrées invalides | Profil et entretien mal formés refusés avant écriture, contenu antérieur conservé. |
| Isolation | Une clé fictive d'une autre application reste intacte dans tous les tests simulés ; tous les appels de lecture/écriture ciblent uniquement la clé JobView. |
| Absence de mutation | Entrées gelées acceptées ; résultat détaché par sérialisation. Modifier le résultat ne modifie pas les données persistées. |
| Fournisseur navigateur | Le fournisseur par défaut utilise le localStorage isolé de jsdom ; sauvegarde et relecture par une nouvelle instance réussies. La clé de test est retirée après le scénario. |

## Revue et limites

Le service centralise l'accès au stockage et relit l'enveloppe avant toute écriture. La réussite suit `setItem`, sans état en mémoire annonçant une sauvegarde échouée. La validation de structure réutilise les règles de phase 1 après vérification des types. Les champs inconnus sont refusés pour éviter leur perte silencieuse lors d'une réécriture. Aucun changement de modèle, interface, suppression, migration, réseau ou dépendance n'est introduit.

Les premières tentatives d'accès au cache Corepack et de création de branche ont été bloquées dans le bac à sable. Elles ont été relancées avec autorisation ; pnpm et la branche ont ensuite été vérifiés. Ces problèmes d'environnement n'ont pas nécessité de changement de configuration du projet.

Aucune anomalie bloquante relevée lors de la revue des trois nouveaux fichiers et des résultats. Limite connue : localStorage ne fournit pas de transaction entre onglets ; la relecture avant écriture ne garantit pas la concurrence entre écritures simultanées.

**Non vérifié à cette phase :** interface, affichage mobile, erreurs visibles à l'écran et fermeture/réouverture réelle du navigateur. Les tests jsdom ne remplacent pas cette recette ; elle appartient aux phases 3 et 4. Le service est testé et typé mais n'est pas encore relié à l'application, qui affiche toujours le titre.

## Conclusion

**Gate locale phase 2 validée : OUI**, sur les tests simulés, l'intégration jsdom, la compilation et la vérification des types ci-dessus.

La phase 3 peut être planifiée. Son interface, sa recette navigateur et le déploiement ne sont pas réalisés par cette phase.
