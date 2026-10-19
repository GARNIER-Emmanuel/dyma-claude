import { describe, expect, it } from 'vitest';
import { storageReadMessage, storageSaveMessage } from './storage-messages';
import type { StorageSaveResult, UnsafeStorageRead } from './storage-data';

describe('Messages du stockage', () => {
  it.each<UnsafeStorageRead>([
    { status: 'invalid-data', reason: 'invalid-json' },
    { status: 'invalid-data', reason: 'invalid-format' },
    { status: 'unknown-version', version: 2 }, { status: 'access-denied' },
  ])('explique la lecture non sûre $status', (read) => {
    expect(storageReadMessage(read)).toContain('indisponible');
    expect(storageSaveMessage({ status: 'blocked', read })).toBe(storageReadMessage(read));
  });
  it.each<Exclude<StorageSaveResult, { status: 'saved' | 'blocked' }>>([
    { status: 'quota-exceeded' }, { status: 'access-denied' }, { status: 'write-failed' },
    { status: 'duplicate-id' }, { status: 'invalid-input' },
  ])('explique l’échec $status sans annoncer une réussite', (result) => {
    expect(storageSaveMessage(result).length).toBeGreaterThan(20);
    expect(storageSaveMessage(result)).not.toContain('enregistré.');
  });
});
