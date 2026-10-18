# Phase 1 — plan d'implémentation proposé

Statut : **en attente de validation de l'utilisateur**. La demande d'organisation documentaire n'autorise pas l'implémentation de ce plan.

Références : [spécification](spec.md), [design-doc](../../../design-doc.md), [tranche verticale](../../../tranche-verticale.md), [consignes du dépôt](../../../AGENTS.md) et [de l'application](../../../src/app/AGENTS.md).

## État du code et cohérence

Le code observé affiche le titre JobView et comporte un test de démarrage. Les modèles métier et validations restent à créer. L'organisation réelle est une application Angular unique avec les sources dans `src/`, conformément aux documents actuels.

La V1 du design-doc est plus large que la première tranche. Pour cette phase, les modèles d'entretien sont limités aux quatre champs obligatoires, aux deux notes facultatives, au feeling facultatif et à l'identité de l'entretien.

## Types proposés

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

export function isValidRating(value: unknown): boolean;
export function isValidFeeling(value: unknown): boolean;
export function isValidInterviewDate(value: string): boolean;
export function validateInterview(
  input: Readonly<InterviewDraft>
): InterviewValidationErrors;
```

Ces déclarations décrivent les contrats envisagés ; ce ne sont pas des fichiers source déjà créés.

### Profil

Les chaînes peuvent être vides et la liste de compétences peut être vide. Aucun champ obligatoire, seuil salarial, ordre entre bornes, nombre de compétences ou liste fermée de contrats n'est ajouté. Aucun validateur métier de profil n'est prévu sans règle spécifiée.

Le profil complet peut être absent du parcours de création d'un entretien. Sa représentation lors de la persistance sera décidée en phase 2.

### Notes et feeling

Une propriété optionnelle omise, ou lue comme `undefined`, représente l'absence de note ou de feeling. `0` est une note présente. `null` et la chaîne vide ne sont pas retenus comme représentations d'absence dans cette proposition ; ils ne sont pas convertis implicitement.

Une note présente est un nombre fini, entier, entre 0 et 10 inclus. Une chaîne telle que `'7'` est refusée. Un feeling présent doit correspondre exactement à l'une des trois valeurs du type.

### Identité

`id` est une chaîne opaque distincte des données entreprise/poste. Deux entretiens peuvent avoir les mêmes informations et des identifiants différents. Aucune déduplication n'est prévue.

Cette phase définit le type ; elle n'introduit pas de générateur aléatoire, d'horloge ou de fabrique métier. Les tests utilisent des identifiants fictifs explicites. La génération sera raccordée au parcours de création lors de la phase concernée.

## Validations et pureté

- Entreprise, date, poste et contrat sont obligatoires ; les chaînes vides ou composées seulement d'espaces sont refusées.
- La vérification des espaces n'entraîne ni nettoyage ni modification de l'entrée.
- La date est proposée au format `YYYY-MM-DD`, avec une date calendaire réelle, sans restriction passé/futur. Ce contrôle supplémentaire reste à valider.
- `validateInterview` retourne toutes les erreurs détectées, ou un objet vide si l'entretien est valide.
- Les erreurs sont des codes métier ; leur traduction en messages d'interface est reportée à la phase 3.
- Aucun profil n'est nécessaire à la validation d'un entretien.
- Aucune validation ne recalcule ni ne modifie une note à partir du profil ou du feeling.
- Les fonctions n'importent pas Angular et n'accèdent ni au DOM, ni au stockage, ni au réseau, ni à une source de temps ou de hasard.
- Les fonctions examinent les données sans mutation et donnent les mêmes résultats pour les mêmes entrées.

## Décisions ouvertes avant implémentation

| Point | Proposition | Statut |
|---|---|---|
| Salaire souhaité du profil | Texte libre ; unité et structure numérique non imposées | À valider |
| Télétravail et contrats | Texte libre sans liste fermée | À valider |
| Compétences | Liste de chaînes sans règle de quantité | À valider |
| Notes et feeling absents | Propriétés optionnelles, absence représentée par `undefined` | À valider |
| Date | Format `YYYY-MM-DD` et date réelle, sans limite passé/futur | À valider ; dépasse la seule présence explicitement demandée |
| Identité | Chaîne opaque, génération hors des validations | À valider |

Ces propositions n'ont pas encore été approuvées. Si un choix change, actualiser le plan et les cas de tests avant d'écrire le code.

## Fichiers à créer après accord

| Fichier dans le dépôt | Rôle |
|---|---|
| `src/app/profile.ts` | Type du profil |
| `src/app/interview.ts` | Brouillon, entretien identifié et feeling |
| `src/app/interview-validation.ts` | Fonctions pures et type des erreurs |
| `src/app/interview-validation.spec.ts` | Tests métier ciblés |

Aucun changement de composant, configuration, dépendance, stockage ou document de référence n'est prévu dans ce plan.

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

Le test de démarrage existant reste couvert. Les tests métier importent directement les fonctions, sans TestBed ni accès au DOM. Une exécution ciblée dans l'environnement Node de Vitest devra confirmer cette indépendance ; sa commande exacte sera vérifiée avec l'outillage disponible.

## Validation prévue

Depuis la racine du projet :

```powershell
pnpm test
pnpm build
```

Node observé : 24.18.1. Le projet déclare pnpm 10.15.1 ; lors de l'analyse, son exécution n'a pas pu aboutir avec le cache disponible sans téléchargement. Ce constat concerne l'environnement observé, pas une erreur du code. Vérifier de nouveau l'outillage au moment de l'implémentation.

Aucune commande de test ou de compilation n'a été exécutée pour cet ajout documentaire. La gate exige des résultats réels et la correspondance règles/scénarios ; voir [validation.md](validation.md).
