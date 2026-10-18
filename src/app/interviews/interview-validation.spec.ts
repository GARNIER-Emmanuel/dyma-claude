// @vitest-environment node

import { describe, expect, it } from 'vitest';
import type { Feeling, Interview, InterviewDraft } from './interview';
import type { Profile } from '../profile/profile';
import {
  isValidFeeling,
  isValidInterviewDate,
  isValidRating,
  validateInterview,
} from './interview-validation';

function validDraft(): InterviewDraft {
  return {
    company: 'Entreprise Exemple',
    date: '2026-10-18',
    position: 'Développeur',
    contract: 'CDI',
  };
}

describe('Notes manuelles', () => {
  it.each([0, 1, 5, 9, 10])('accepte la note entière %s', (value) => {
    expect(isValidRating(value)).toBe(true);
  });

  it.each([-1, 11, 2.5, NaN, Infinity, -Infinity, '7', '', null, undefined, true, {}])(
    'refuse la note invalide %s sans conversion',
    (value) => {
      expect(isValidRating(value)).toBe(false);
    },
  );
});

describe('Feeling', () => {
  it.each<Feeling>(['Super bon', 'OK', 'Pas top'])('accepte %s', (value) => {
    expect(isValidFeeling(value)).toBe(true);
  });

  it.each(['Autre', 'ok', ' OK ', '', null, undefined, 0, {}])(
    'refuse le feeling invalide %s',
    (value) => {
      expect(isValidFeeling(value)).toBe(false);
    },
  );
});

describe('Date calendaire', () => {
  it.each(['0001-01-01', '1999-12-31', '2000-02-29', '2024-02-29', '2026-10-18', '9999-12-31'])(
    'accepte la date %s sans limite passé ou futur',
    (value) => {
      expect(isValidInterviewDate(value)).toBe(true);
    },
  );

  it.each([
    '', ' ', '18/10/2026', '2026-1-01', '2026-01-1', '2026-10-18T00:00:00Z',
    ' 2026-10-18', '2026-10-18 ', '2026-10-18\n', '2026-10-18\r\n',
    '0000-01-01', '2026-00-10', '2026-13-10',
    '2026-01-00', '2026-01-32', '2026-04-31', '2026-02-29', '1900-02-29', '2100-02-29',
  ])('refuse une date mal formée ou impossible : %s', (value) => {
    expect(isValidInterviewDate(value)).toBe(false);
  });
});

describe('Validation de l’entretien', () => {
  it('accepte les seuls champs obligatoires, sans profil ni évaluations', () => {
    expect(validateInterview(validDraft())).toEqual({});
  });

  describe.each(['company', 'date', 'position', 'contract'] as const)('champ obligatoire %s', (field) => {
    it.each(['', '   ', '\t\n'])('refuse une valeur vide ou des espaces seuls', (value) => {
      expect(validateInterview({ ...validDraft(), [field]: value })).toEqual({ [field]: 'required' });
    });
  });

  it('retourne toutes les erreurs en un seul appel', () => {
    const input = {
      company: '', date: '', position: '', contract: '',
      conditionsRating: -1, compatibilityRating: 11, feeling: 'Autre',
    } as unknown as InterviewDraft;

    expect(validateInterview(input)).toEqual({
      company: 'required', date: 'required', position: 'required', contract: 'required',
      conditionsRating: 'invalid-rating', compatibilityRating: 'invalid-rating',
      feeling: 'invalid-feeling',
    });
  });

  it('distingue une date absente d’une date impossible', () => {
    expect(validateInterview({ ...validDraft(), date: '2026-02-30' })).toEqual({ date: 'invalid-date' });
  });

  describe.each(['conditionsRating', 'compatibilityRating'] as const)('évaluation %s', (field) => {
    it.each([undefined, 0, 5, 10])('accepte indépendamment la valeur %s', (value) => {
      expect(validateInterview({ ...validDraft(), [field]: value })).toEqual({});
    });

    it.each([-1, 11, 1.5, NaN, Infinity, -Infinity, '7', '', null])(
      'retourne une erreur pour %s',
      (value) => {
        const input = { ...validDraft(), [field]: value } as unknown as InterviewDraft;
        expect(validateInterview(input)).toEqual({ [field]: 'invalid-rating' });
      },
    );
  });

  it.each<Feeling | undefined>([undefined, 'Super bon', 'OK', 'Pas top'])(
    'accepte le feeling facultatif %s sans modifier les notes',
    (feeling) => {
      const input = Object.freeze({
        ...validDraft(), conditionsRating: 0, compatibilityRating: 10, feeling,
      });
      expect(validateInterview(input)).toEqual({});
      expect(input.conditionsRating).toBe(0);
      expect(input.compatibilityRating).toBe(10);
    },
  );

  it.each(['Autre', '', null, 'ok'])('refuse un feeling renseigné invalide : %s', (feeling) => {
    const input = { ...validDraft(), feeling } as unknown as InterviewDraft;
    expect(validateInterview(input)).toEqual({ feeling: 'invalid-feeling' });
  });

  it('préserve l’absence de note et la note zéro sans ajouter de propriété', () => {
    const input = Object.freeze({ ...validDraft(), conditionsRating: 0 });
    expect(validateInterview(input)).toEqual({});
    expect(input.conditionsRating).toBe(0);
    expect(input).not.toHaveProperty('compatibilityRating');
  });

  it('accepte des entretiens indépendants avec les mêmes entreprise et poste', () => {
    const first: Interview = Object.freeze({ ...validDraft(), id: 'entretien-1', conditionsRating: 0 });
    const second: Interview = Object.freeze({ ...validDraft(), id: 'entretien-2', conditionsRating: 10 });
    expect(validateInterview(first)).toEqual({});
    expect(validateInterview(second)).toEqual({});
    expect(first.id).not.toBe(second.id);
    expect(first.conditionsRating).toBe(0);
    expect(second.conditionsRating).toBe(10);
  });

  it('n’impose aucune règle au profil et ne le lie pas aux évaluations', () => {
    const profile: Profile = {
      skills: [], desiredJob: '', desiredSalaryRange: '', workingHours: '',
      remoteWork: '', location: '', desiredContract: '',
    };
    const input = Object.freeze({ ...validDraft(), conditionsRating: 3, compatibilityRating: 8 });
    expect(validateInterview(input)).toEqual({});
    profile.skills = ['Compétence fictive'];
    profile.desiredJob = 'Autre métier';
    profile.desiredSalaryRange = 'À discuter';
    expect(validateInterview(input)).toEqual({});
    expect(input.conditionsRating).toBe(3);
    expect(input.compatibilityRating).toBe(8);
  });

  it('reste déterministe et ne nettoie ni ne modifie une entrée gelée', () => {
    const input = Object.freeze({ ...validDraft(), company: '  Exemple  ', conditionsRating: 0 });
    const before = { ...input };
    const first = validateInterview(input);
    expect(validateInterview(input)).toEqual(first);
    expect(first).toEqual({});
    expect(input).toEqual(before);
  });

  it('ne modifie pas non plus les données invalides', () => {
    const input = Object.freeze({ ...validDraft(), company: ' ', conditionsRating: -1 });
    const before = { ...input };
    expect(validateInterview(input)).toEqual({ company: 'required', conditionsRating: 'invalid-rating' });
    expect(input).toEqual(before);
  });
});
