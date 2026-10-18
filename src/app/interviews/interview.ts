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
