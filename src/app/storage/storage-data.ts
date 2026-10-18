import type { Interview } from '../interviews/interview';
import { validateInterview } from '../interviews/interview-validation';
import type { Profile } from '../profile/profile';

export interface StorageData {
  readonly version: 1;
  readonly profile: Profile | null;
  readonly interviews: readonly Interview[];
}

export type UnsafeStorageRead =
  | { status: 'invalid-data'; reason: 'invalid-json' | 'invalid-format' }
  | { status: 'unknown-version'; version: number }
  | { status: 'access-denied' };

export type StorageReadResult =
  | { status: 'empty' }
  | { status: 'ready'; data: StorageData }
  | UnsafeStorageRead;

export type StorageSaveResult =
  | { status: 'saved'; data: StorageData }
  | { status: 'blocked'; read: UnsafeStorageRead }
  | { status: 'invalid-input' }
  | { status: 'duplicate-id' }
  | { status: 'quota-exceeded' }
  | { status: 'access-denied' }
  | { status: 'write-failed' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

const PROFILE_TEXT_FIELDS = [
  'desiredJob', 'desiredSalaryRange', 'workingHours', 'remoteWork', 'location', 'desiredContract',
] as const;

export function isStoredProfile(value: unknown): value is Profile {
  return isRecord(value)
    && hasOnlyKeys(value, ['skills', ...PROFILE_TEXT_FIELDS])
    && Array.isArray(value['skills'])
    && value['skills'].every((skill: unknown) => typeof skill === 'string')
    && PROFILE_TEXT_FIELDS.every((field) => typeof value[field] === 'string');
}

export function isStoredInterview(value: unknown): value is Interview {
  if (!isRecord(value)
    || !hasOnlyKeys(value, [
      'id', 'company', 'date', 'position', 'contract',
      'conditionsRating', 'compatibilityRating', 'feeling',
    ])
    || typeof value['id'] !== 'string' || value['id'].trim().length === 0
    || !['company', 'date', 'position', 'contract'].every((field) => typeof value[field] === 'string')) {
    return false;
  }

  // Types are checked before calling the phase 1 validator, which expects strings.
  return Object.keys(validateInterview({
    company: value['company'] as string,
    date: value['date'] as string,
    position: value['position'] as string,
    contract: value['contract'] as string,
    conditionsRating: value['conditionsRating'] as Interview['conditionsRating'],
    compatibilityRating: value['compatibilityRating'] as Interview['compatibilityRating'],
    feeling: value['feeling'] as Interview['feeling'],
  })).length === 0;
}

export function parseStorageData(value: unknown): StorageReadResult {
  if (!isRecord(value) || !Number.isInteger(value['version'])) {
    return { status: 'invalid-data', reason: 'invalid-format' };
  }
  if (value['version'] !== 1) {
    return { status: 'unknown-version', version: value['version'] as number };
  }
  if (!hasOnlyKeys(value, ['version', 'profile', 'interviews'])
    || !(value['profile'] === null || isStoredProfile(value['profile']))
    || !Array.isArray(value['interviews'])
    || !value['interviews'].every(isStoredInterview)) {
    return { status: 'invalid-data', reason: 'invalid-format' };
  }

  const interviews = value['interviews'];
  if (new Set(interviews.map((interview) => interview.id)).size !== interviews.length) {
    return { status: 'invalid-data', reason: 'invalid-format' };
  }
  return {
    status: 'ready',
    data: { version: 1, profile: value['profile'], interviews },
  };
}
