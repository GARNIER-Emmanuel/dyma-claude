# Phase 1 — validation et preuves

Statut : **gate locale validée le 18 octobre 2026**.

Références : [spécification](spec.md) et [plan](plan-implementation.md).

## Contrôles obligatoires

- [x] Le lancement de la phase autorise le plan proposé ; représentations retenues et annoncées avant l'implémentation.
- [x] Les quatre champs obligatoires et les cas limites sont couverts.
- [x] Les notes absentes sont distinctes de zéro ; notes entières de 0 à 10 seulement.
- [x] Les valeurs autorisées et le caractère facultatif du feeling sont couverts.
- [x] Les entretiens restent indépendants et aucune note n'est calculée ou modifiée implicitement.
- [x] Les fonctions et leurs tests sont indépendants du DOM, du stockage et de TestBed.
- [x] La revue confirme l'absence de mutation des entrées et d'effets de bord.
- [x] `pnpm test` réussit sur le code de la phase, avec une sortie conservée.
- [x] `pnpm build` réussit sur le même état du code, avec une sortie conservée.
- [x] La revue confirme le respect du périmètre, l'absence de fonctionnalités anticipées et de dépendances nouvelles, ainsi que les tests des cas limites.

## Environnement et état du code

- Date : 18 octobre 2026, Europe/Paris.
- Dépôt : `C:\dev\Perso\Learn\dymacourse\dyma-claude`.
- Branche : `feat/phase-1-modeles-validations`, créée depuis `c2ff09d` ; modifications locales non commitées.
- Versions vérifiées : Node 24.18.1, pnpm 10.15.1, Vitest 5.0.0.
- Sources métier ajoutées : `src/app/profile/profile.ts`, `src/app/interviews/interview.ts`, `src/app/interviews/interview-validation.ts` et `src/app/interviews/interview-validation.spec.ts`.
- Les sorties ci-dessous correspondent au même état final des quatre fichiers source.

## Résultats observés

| Contrôle | Résultat observé | Preuve | Statut |
|---|---|---|---|
| `pnpm exec vitest run src/app/interviews/interview-validation.spec.ts --environment node` | 107 tests métier réussis, un fichier ; aucun DOM ni TestBed | [Sortie Node](preuves/tests-metier-node.txt) | Réussi |
| `pnpm test` | 108 tests réussis, deux fichiers, dont le test de démarrage Angular existant | [Sortie complète](preuves/tests-complets.txt) | Réussi |
| `pnpm build` | Compilation de production réussie, sortie `dist/jobview` | [Compilation](preuves/compilation.txt) | Réussi |
| `pnpm exec tsc --project tsconfig.spec.json --noEmit` | Code de sortie 0, aucun diagnostic | [Vérification des types](preuves/types.txt) | Réussi |

## Correspondance règles et scénarios

Les scénarios sont dans `src/app/interviews/interview-validation.spec.ts`.

| Règle | Scénarios et observations |
|---|---|
| Entreprise, date, poste, contrat obligatoires | Chaque champ est testé vide et avec des espaces seuls ; toutes les erreurs sont retournées ensemble. |
| Date réelle et format exact | Dates passées et futures, année 0001 et 9999, années bissextiles 2000/2024, refus de 1900/2100, mois/jours impossibles, espaces, horodatage et retours à la ligne. |
| Notes facultatives, zéro distinct de l'absence | Chaque note testée indépendamment avec `undefined`, 0, 5 et 10 ; l'absence d'une propriété reste intacte. |
| Notes entières de 0 à 10 | Refus des valeurs hors bornes, décimales, NaN, infinis, chaînes numériques, chaîne vide et null sans conversion implicite. |
| Feeling facultatif et valeurs exactes | Absence et trois valeurs acceptées ; inconnues, casse différente, chaîne vide et null refusés. |
| Aucun profil préalable ou score calculé | Un brouillon seul est valide ; un profil vide est représentable et sa modification ne change pas les notes de l'entretien. |
| Entretiens indépendants | Même entreprise et même poste, identifiants fictifs distincts et notes différentes acceptés sans déduplication. |
| Pureté | Entrées valides et invalides gelées, résultats identiques lors d'appels répétés, textes et notes conservés. |

## Revue et anomalies

Revue des quatre fichiers : seuls des types, prédicats et calculs déterministes sont ajoutés. Aucun import Angular, accès au DOM, au réseau ou au stockage, aucune horloge, aucun hasard. Aucun composant, dépendance, fichier de configuration ou document de référence global n'est modifié.

Une anomalie repérée pendant la revue a été corrigée : une expression régulière terminée par `$` pouvait accepter un retour à la ligne final dans une date. Le contrôle exige désormais exactement dix caractères ; deux cas de régression couvrent les fins de ligne LF et CRLF. Tous les contrôles ont été relancés après cette correction.

La validation reçoit des champs obligatoires déjà typés comme chaînes. Elle ne valide pas un document JSON arbitraire ; cette protection sera traitée à la frontière du stockage en phase 2. Les identifiants sont définis par le type et fournis explicitement dans les tests ; leur génération reste hors phase 1.

## Conclusion

### Vérification après rangement par fonctionnalité

Le 18 octobre 2026, les quatre fichiers métier ont été regroupés dans `src/app/profile/` et `src/app/interviews/`, conformément au rangement ajouté au design-doc. L'import du profil dans les tests et les chemins du plan ont été adaptés. Les preuves conservées dans `preuves/` décrivent l'exécution initiale avant ce déplacement.

Après le déplacement, `pnpm test` a de nouveau réussi avec **108 tests dans deux fichiers**, et `pnpm build` a réussi. Aucune logique métier n'a été modifiée.

**Gate phase 1 validée : OUI, sur les vérifications locales ci-dessus.**

La phase 2 peut être planifiée ; elle n'est pas commencée. La persistance, l'interface du parcours, la recette navigateur et le déploiement restent à réaliser dans leurs phases respectives.
