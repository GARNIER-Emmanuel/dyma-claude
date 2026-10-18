import { inject, Injectable, InjectionToken } from '@angular/core';
import type { Interview } from '../interviews/interview';
import type { Profile } from '../profile/profile';
import {
  isStoredInterview,
  isStoredProfile,
  parseStorageData,
  type StorageData,
  type StorageReadResult,
  type StorageSaveResult,
} from './storage-data';

export const JOBVIEW_STORAGE_KEY = 'jobview:data';

export type JobViewStorageAccess = () => Pick<Storage, 'getItem' | 'setItem'>;

export const JOBVIEW_STORAGE_ACCESS = new InjectionToken<JobViewStorageAccess>(
  'JobView local storage access',
  { providedIn: 'root', factory: () => () => globalThis.localStorage },
);

@Injectable({ providedIn: 'root' })
export class JobViewStorage {
  private readonly getStorage = inject(JOBVIEW_STORAGE_ACCESS);

  load(): StorageReadResult {
    try {
      return this.read(this.getStorage());
    } catch {
      return { status: 'access-denied' };
    }
  }

  saveProfile(profile: Profile): StorageSaveResult {
    if (!isStoredProfile(profile)) {
      return { status: 'invalid-input' };
    }
    return this.save((data) => ({ ...data, profile }));
  }

  addInterview(interview: Interview): StorageSaveResult {
    if (!isStoredInterview(interview)) {
      return { status: 'invalid-input' };
    }
    return this.save((data) => data.interviews.some((item) => item.id === interview.id)
      ? null
      : { ...data, interviews: [...data.interviews, interview] });
  }

  private read(storage: ReturnType<JobViewStorageAccess>): StorageReadResult {
    let raw: string | null;
    try {
      raw = storage.getItem(JOBVIEW_STORAGE_KEY);
    } catch {
      return { status: 'access-denied' };
    }
    if (raw === null) {
      return { status: 'empty' };
    }

    let value: unknown;
    try {
      value = JSON.parse(raw);
    } catch {
      return { status: 'invalid-data', reason: 'invalid-json' };
    }
    return parseStorageData(value);
  }

  private save(update: (data: StorageData) => StorageData | null): StorageSaveResult {
    let storage: ReturnType<JobViewStorageAccess>;
    try {
      storage = this.getStorage();
    } catch {
      return { status: 'blocked', read: { status: 'access-denied' } };
    }
    const read = this.read(storage);
    if (read.status !== 'empty' && read.status !== 'ready') {
      return { status: 'blocked', read };
    }
    const data = update(read.status === 'ready'
      ? read.data
      : { version: 1, profile: null, interviews: [] });
    if (data === null) {
      return { status: 'duplicate-id' };
    }

    // Serialize before writing; no in-memory state can advertise an unsaved update.
    let raw: string;
    let snapshot: StorageData;
    try {
      raw = JSON.stringify(data);
      const parsed = parseStorageData(JSON.parse(raw));
      if (parsed.status !== 'ready') {
        return { status: 'invalid-input' };
      }
      snapshot = parsed.data;
    } catch {
      return { status: 'invalid-input' };
    }

    try {
      storage.setItem(JOBVIEW_STORAGE_KEY, raw);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        return { status: 'quota-exceeded' };
      }
      if (error instanceof DOMException && error.name === 'SecurityError') {
        return { status: 'access-denied' };
      }
      return { status: 'write-failed' };
    }
    return { status: 'saved', data: snapshot };
  }
}
