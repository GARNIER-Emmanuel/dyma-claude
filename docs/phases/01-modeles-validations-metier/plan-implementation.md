# Phase 1 — plan d'implémentation

Statut : **implémenté et vérifié le 18 octobre 2026**, après la demande « lance la phase 1 ». Les propositions ci-dessous ont été retenues pour cette implémentation ; résultats dans [validation.md](validation.md).

Références : [spécification](spec.md), [design-doc](../../../design-doc.md), [tranche verticale](../../../tranche-verticale.md), [consignes du dépôt](../../../AGENTS.md) et [de l'application](../../../src/app/AGENTS.md).

## État du code et cohérence

Avant cette phase, le code affichait le titre JobView et comportait un test de démarrage. Les modèles métier et validations sont désormais créés. L'organisation reste une application Angular unique avec les sources dans `src/`, conformément aux documents actuels.

La V1 du design-doc est plus large que la première tranche. Pour cette phase, les modèles d'entretien sont limités aux quatre champs obligatoires, aux deux notes facultatives, au feeling facultatif et à l'identité de l'entretien.

## Types retenus

Les noms de propriétés suivants sont des propositions techniques, pas des règles métier supplémentaires.

```ts
export interface Profile {
  skills: readonly string[];
  desiredJob: string;
  desiredSalaryRange: string;
  workingHours: string;
  remoteWork: string;
  location: string;
  desiredContract: string;
}

export type Feeling = 'Super bon' | 'OK' | 'Pas top';

export interface InterviewDraft {
  company: string;
  date: string;
  position: string;
  contract: string;
  conditionsRating?: number;
  compatibilityRating?: number;
  feeling?: Feeling;
}

export interface Interview extends InterviewDraft {
  readonly id: string;
}

export type InterviewValidationErrors = Partial<{
  company: 'required';
  date: 'required' | 'invalid-date';
  position: 'required';
  contract: 'required';
  conditionsRating: 'invalid-rating';
  compatibilityRating: 'invalid-rating';
  feeling: 'invalid-feeling';
}>;

export function isValidRating(value: unknown): value is number;
export function isValidFeeling(value: unknown): value is Feeling;
export function isValidInterviewDate(value: string): boolean;
export function validateInterview(
  input: Readonly<InterviewDraft>
): InterviewValidationErrors;
```

Ces déclarations correspondent aux contrats implémentés. Les prédicats de type permettent aussi à TypeScript de reconnaître les valeurs valides.

### Profil

Les chaînes peuvent être vides et la liste de compétences peut être vide. Aucun champ obligatoire, seuil salarial, ordre entre bornes, nombre de compétences ou liste fermée de contrats n'est ajouté. Aucun validateur métier de profil n'est prévu sans règle spécifiée.

Le profil complet peut être absent du parcours de création d'un entretien. Sa représentation lors de la persistance sera décidée en phase 2.

### Notes et feeling

Une propriété optionnelle omise, ou lue comme `undefined`, représente l'absence de note ou de feeling. `0` est une note présente. `null` et la chaîne vide ne sont pas des représentations d'absence ; ils ne sont pas convertis implicitement.

Une note présente est un nombre fini, entier, entre 0 et 10 inclus. Une chaîne telle que `'7'` est refusée. Un feeling présent doit correspondre exactement à l'une des trois valeurs du type.

### Identité

`id` est une chaîne opaque distincte des données entreprise/poste. Deux entretiens peuvent avoir les mêmes informations et des identifiants différents. Aucune déduplication n'est prévue.

Cette phase définit le type ; elle n'introduit pas de générateur aléatoire, d'horloge ou de fabrique métier. Les tests utilisent des identifiants fictifs explicites. La génération sera raccordée au parcours de création lors de la phase concernée.

## Validations et pureté

- Entreprise, date, poste et contrat sont obligatoires ; les chaînes vides ou composées seulement d'espaces sont refusées.
- La vérification des espaces n'entraîne ni nettoyage ni modification de l'entrée.
- La date respecte exactement le format `YYYY-MM-DD`, avec une date calendaire réelle entre les années 0001 et 9999, sans restriction passé/futur. Le contrôle utilise les règles grégoriennes des années bissextiles, sans horloge ni fuseau horaire ; les espaces et retours à la ligne sont refusés.
- `validateInterview` retourne toutes les erreurs détectées, ou un objet vide si l'entretien est valide.
- Les erreurs sont des codes métier ; leur traduction en messages d'interface est reportée à la phase 3.
- Aucun profil n'est nécessaire à la validation d'un entretien.
- Aucune validation ne recalcule ni ne modifie une note à partir du profil ou du feeling.
- Les fonctions n'importent pas Angular et n'accèdent ni au DOM, ni au stockage, ni au réseau, ni à une source de temps ou de hasard.
- Les fonctions examinent les données sans mutation et donnent les mêmes résultats pour les mêmes entrées.

## Décisions retenues au lancement

| Point | Proposition | Statut |
|---|---|---|
| Salaire souhaité du profil | Texte libre ; unité et structure numérique non imposées | Retenu |
| Télétravail et contrats | Texte libre sans liste fermée | Retenu |
| Compétences | Liste de chaînes sans règle de quantité | Retenu |
| Notes et feeling absents | Propriétés optionnelles, absence représentée par `undefined` | Retenu |
| Date | Format `YYYY-MM-DD` et date réelle, sans limite passé/futur | Retenu selon le plan proposé |
| Identité | Chaîne opaque, génération hors des validations | Retenu |

La demande de lancement autorise l'implémentation du plan proposé. Ces choix ont été annoncés avant l'écriture du code. Si un choix évolue, actualiser le plan et les tests concernés.

## Fichiers créés

| Fichier dans le dépôt | Rôle |
|---|---|
| `src/app/profile/profile.ts` | Type du profil |
| `src/app/interviews/interview.ts` | Brouillon, entretien identifié et feeling |
| `src/app/interviews/interview-validation.ts` | Fonctions pures et type des erreurs |
| `src/app/interviews/interview-validation.spec.ts` | Tests métier ciblés |

Aucun composant, configuration, dépendance, stockage ou document de référence n'a été modifié. Les documents de suivi de cette phase et l'index ont été actualisés ; les sorties de vérification sont conservées dans `preuves/`.

## Étapes après validation

1. Vérifier l'état Git et préserver les modifications existantes ; travailler sur une branche dédiée à l'implémentation.
2. Fixer les représentations approuvées et créer les types.
3. Écrire les tests des règles et cas limites, puis les fonctions de validation.
4. Vérifier la pureté et l'absence de dépendances Angular ou navigateur.
5. Exécuter les commandes et consigner les résultats dans [validation.md](validation.md).
6. S'arrêter à la phase 1 et présenter la gate ; ne pas commencer le stockage.

## Tests prévus

| Domaine | Cas |
|---|---|
| Champs obligatoires | Chaque champ vide séparément ; espaces seuls ; plusieurs erreurs simultanées |
| Notes valides | Absence, 0, entier intermédiaire, 10 ; chaque note facultative indépendamment |
| Notes invalides | -1, 11, décimale, NaN, infinis, chaîne numérique, null selon la représentation approuvée |
| Feeling | Absence, trois valeurs autorisées, valeur inconnue et null selon la représentation approuvée |
| Date | Absence ; format invalide ; date impossible ; année bissextile ; dates passées et futures si le choix est approuvé |
| Indépendance | Entretiens distincts à entreprise/poste identiques acceptés ; aucun profil requis ; évaluations inchangées après validation quel que soit le feeling |
| Pureté | Entrées gelées ; appels répétés ; données et notes inchangées |

Le test de démarrage existant reste couvert. Les tests métier importent directement les fonctions, sans TestBed ni accès au DOM. Leur exécution ciblée dans l'environnement Node de Vitest confirme cette indépendance.

`validateInterview` reçoit un objet typé `InterviewDraft`, dont les champs obligatoires sont des chaînes. Cette fonction n'est pas un parseur de JSON arbitraire ni un validateur de format de stockage ; la protection des lectures de données externes appartient à la phase 2.

## Validation prévue

Depuis la racine du projet :

```powershell
pnpm test
pnpm build
pnpm exec vitest run src/app/interviews/interview-validation.spec.ts --environment node
pnpm exec tsc --project tsconfig.spec.json --noEmit
```

Versions vérifiées lors de l'implémentation : Node 24.18.1 et pnpm 10.15.1. Les commandes ont été exécutées avec succès sur la branche `feat/phase-1-modeles-validations`.

Les résultats et la correspondance règles/scénarios sont consignés dans [validation.md](validation.md). La phase 2 n'est pas commencée.
