import type { Feeling, InterviewDraft } from './interview';

export type InterviewValidationErrors = Partial<{
  company: 'required';
  date: 'required' | 'invalid-date';
  position: 'required';
  contract: 'required';
  conditionsRating: 'invalid-rating';
  compatibilityRating: 'invalid-rating';
  feeling: 'invalid-feeling';
}>;

export function isValidRating(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10;
}

export function isValidFeeling(value: unknown): value is Feeling {
  return value === 'Super bon' || value === 'OK' || value === 'Pas top';
}

export function isValidInterviewDate(value: string): boolean {
  if (value.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  if (year === 0 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

export function validateInterview(input: Readonly<InterviewDraft>): InterviewValidationErrors {
  const errors: InterviewValidationErrors = {};

  for (const field of ['company', 'date', 'position', 'contract'] as const) {
    if (input[field].trim().length === 0) {
      errors[field] = 'required';
    }
  }

  if (!errors.date && !isValidInterviewDate(input.date)) {
    errors.date = 'invalid-date';
  }

  for (const field of ['conditionsRating', 'compatibilityRating'] as const) {
    if (input[field] !== undefined && !isValidRating(input[field])) {
      errors[field] = 'invalid-rating';
    }
  }

  if (input.feeling !== undefined && !isValidFeeling(input.feeling)) {
    errors.feeling = 'invalid-feeling';
  }

  return errors;
}
