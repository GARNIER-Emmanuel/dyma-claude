import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Interview } from '../interviews/interview';
import type { Profile } from '../profile/profile';
import {
  JOBVIEW_STORAGE_ACCESS,
  JOBVIEW_STORAGE_KEY,
  JobViewStorage,
  type JobViewStorageAccess,
} from './jobview-storage';
import type { StorageData, StorageReadResult } from './storage-data';

function profile(): Profile {
  return {
    skills: ['Angular', 'Java'], desiredJob: 'Développeur', desiredSalaryRange: '40–45 k€',
    workingHours: '35 h', remoteWork: 'Deux jours', location: 'Ville Exemple', desiredContract: 'CDI',
  };
}

function interview(id = 'entretien-fictif-1'): Interview {
  return {
    id, company: 'Entreprise Exemple', date: '2026-10-18', position: 'Développeur', contract: 'CDI',
    conditionsRating: 0, feeling: 'OK',
  };
}

function storedData(): StorageData {
  return { version: 1, profile: profile(), interviews: [interview()] };
}

class MemoryStorage {
  readonly entries = new Map<string, string>([['autre-application', 'à conserver']]);
  readonly getItem = vi.fn((key: string) => this.entries.get(key) ?? null);
  readonly setItem = vi.fn((key: string, value: string) => { this.entries.set(key, value); });
}

function newService(): JobViewStorage {
  return TestBed.runInInjectionContext(() => new JobViewStorage());
}

function configure(access: JobViewStorageAccess): void {
  TestBed.configureTestingModule({ providers: [{ provide: JOBVIEW_STORAGE_ACCESS, useValue: access }] });
}

const writes = [
  { name: 'profil', run: (service: JobViewStorage) => service.saveProfile(profile()) },
  { name: 'entretien', run: (service: JobViewStorage) => service.addInterview(interview('nouveau')) },
];

describe('Persistance locale JobView', () => {
  let memory: MemoryStorage;
  let service: JobViewStorage;

  beforeEach(() => {
    TestBed.resetTestingModule();
    memory = new MemoryStorage();
    configure(() => memory);
    service = TestBed.inject(JobViewStorage);
  });

  afterEach(() => {
    expect(memory.entries.get('autre-application')).toBe('à conserver');
    expect(memory.getItem.mock.calls.every(([key]) => key === JOBVIEW_STORAGE_KEY)).toBe(true);
    expect(memory.setItem.mock.calls.every(([key]) => key === JOBVIEW_STORAGE_KEY)).toBe(true);
  });

  it('charge un stockage vide sans initialisation implicite', () => {
    expect(service.load()).toEqual({ status: 'empty' });
    expect(memory.setItem).not.toHaveBeenCalled();
    expect(memory.entries.has(JOBVIEW_STORAGE_KEY)).toBe(false);
  });

  it('enregistre puis relit un profil par une nouvelle instance', () => {
    const data: StorageData = { version: 1, profile: profile(), interviews: [] };
    expect(service.saveProfile(profile())).toEqual({ status: 'saved', data });
    expect(newService().load()).toEqual({ status: 'ready', data });
    expect(JSON.parse(memory.entries.get(JOBVIEW_STORAGE_KEY)!)).toEqual(data);
  });

  it('crée sans profil, conserve zéro et omet les notes absentes en JSON', () => {
    const item = { ...interview(), compatibilityRating: undefined, feeling: undefined };
    const expected = { ...interview() };
    delete expected.feeling;
    expect(service.addInterview(item)).toEqual({
      status: 'saved', data: { version: 1, profile: null, interviews: [expected] },
    });
    const loaded = newService().load();
    expect(loaded).toEqual({ status: 'ready', data: { version: 1, profile: null, interviews: [expected] } });
    if (loaded.status !== 'ready') { throw new Error('Données attendues'); }
    expect(loaded.data.interviews[0].conditionsRating).toBe(0);
    expect(loaded.data.interviews[0]).not.toHaveProperty('compatibilityRating');
    expect(loaded.data.interviews[0]).not.toHaveProperty('feeling');
    expect(item).toHaveProperty('compatibilityRating', undefined);
  });

  it('préserve toutes les données lors des écritures successives dans les deux ordres', () => {
    expect(service.addInterview(interview()).status).toBe('saved');
    expect(service.saveProfile(profile()).status).toBe('saved');
    const second = { ...interview('entretien-fictif-2'), conditionsRating: 10, compatibilityRating: 0 };
    expect(service.addInterview(second).status).toBe('saved');
    const updated = { ...profile(), skills: [], desiredJob: 'Autre métier' };
    expect(service.saveProfile(updated).status).toBe('saved');
    expect(newService().load()).toEqual({
      status: 'ready', data: { version: 1, profile: updated, interviews: [interview(), second] },
    });
  });

  it('accepte le profil vide sans ajouter de règles métier', () => {
    const empty: Profile = {
      skills: [], desiredJob: '', desiredSalaryRange: '', workingHours: '',
      remoteWork: '', location: '', desiredContract: '',
    };
    expect(service.saveProfile(empty).status).toBe('saved');
    expect(newService().load()).toEqual({
      status: 'ready', data: { version: 1, profile: empty, interviews: [] },
    });
  });

  it('ne modifie ni les entrées gelées ni les données persistées par référence', () => {
    const inputProfile = Object.freeze({ ...profile(), skills: Object.freeze(['Angular']) });
    const item = Object.freeze(interview());
    expect(service.saveProfile(inputProfile).status).toBe('saved');
    const result = service.addInterview(item);
    expect(result.status).toBe('saved');
    if (result.status !== 'saved') { throw new Error('Sauvegarde attendue'); }
    expect(result.data.profile).not.toBe(inputProfile);
    expect(result.data.interviews[0]).not.toBe(item);
    result.data.profile!.skills = ['Modifié en mémoire'];
    result.data.interviews[0].conditionsRating = 9;
    expect(newService().load()).toEqual({
      status: 'ready', data: { version: 1, profile: inputProfile, interviews: [item] },
    });
  });

  it('refuse un identifiant existant sans remplacer ni ajouter un entretien', () => {
    const raw = JSON.stringify(storedData());
    memory.entries.set(JOBVIEW_STORAGE_KEY, raw);
    expect(service.addInterview({ ...interview(), company: 'Autre entreprise' })).toEqual({ status: 'duplicate-id' });
    expect(memory.setItem).not.toHaveBeenCalled();
    expect(memory.entries.get(JOBVIEW_STORAGE_KEY)).toBe(raw);
  });

  it('relit les données persistées à chaque écriture, même après un chargement vide', () => {
    expect(service.load()).toEqual({ status: 'empty' });
    memory.entries.set(JOBVIEW_STORAGE_KEY, JSON.stringify(storedData()));
    expect(service.addInterview(interview('nouveau')).status).toBe('saved');
    expect(newService().load()).toEqual({
      status: 'ready', data: { ...storedData(), interviews: [interview(), interview('nouveau')] },
    });
  });

  const invalidDocuments: { name: string; value: unknown }[] = [
    { name: 'null', value: null },
    { name: 'tableau', value: [] },
    { name: 'scalaire', value: 42 },
    { name: 'sans version', value: { profile: null, interviews: [] } },
    { name: 'version texte', value: { ...storedData(), version: '1' } },
    { name: 'version null', value: { ...storedData(), version: null } },
    { name: 'version fractionnaire', value: { ...storedData(), version: 1.5 } },
    { name: 'profil manquant', value: { version: 1, interviews: [] } },
    { name: 'entretiens manquants', value: { version: 1, profile: null } },
    { name: 'entretiens null', value: { ...storedData(), interviews: null } },
    { name: 'entretiens objet', value: { ...storedData(), interviews: {} } },
    { name: 'profil tableau', value: { ...storedData(), profile: [] } },
    { name: 'profil incomplet', value: { ...storedData(), profile: { desiredJob: 'Développeur' } } },
    { name: 'compétences texte', value: { ...storedData(), profile: { ...profile(), skills: 'Angular' } } },
    { name: 'compétence non textuelle', value: { ...storedData(), profile: { ...profile(), skills: [1] } } },
    ...(['desiredJob', 'desiredSalaryRange', 'workingHours', 'remoteWork', 'location', 'desiredContract'] as const)
      .map((field) => ({ name: `profil ${field} non textuel`, value: { ...storedData(), profile: { ...profile(), [field]: null } } })),
    ...['id', 'company', 'date', 'position', 'contract'].map((field) => ({
      name: `entretien ${field} non textuel`, value: { ...storedData(), interviews: [{ ...interview(), [field]: 42 }] },
    })),
    ...['id', 'company', 'date', 'position', 'contract'].map((field) => ({
      name: `entretien ${field} vide`, value: { ...storedData(), interviews: [{ ...interview(), [field]: '  ' }] },
    })),
    { name: 'date impossible', value: { ...storedData(), interviews: [{ ...interview(), date: '2026-02-30' }] } },
    ...['conditionsRating', 'compatibilityRating'].flatMap((field) => [null, '0', -1, 11, 1.5].map((value) => ({
      name: `${field} invalide ${value}`, value: { ...storedData(), interviews: [{ ...interview(), [field]: value }] },
    }))),
    ...[null, '', 'Inconnu'].map((feeling) => ({
      name: `feeling invalide ${feeling}`, value: { ...storedData(), interviews: [{ ...interview(), feeling }] },
    })),
    { name: 'entretien null', value: { ...storedData(), interviews: [null] } },
    { name: 'entretien tableau', value: { ...storedData(), interviews: [[]] } },
    { name: 'entretien incomplet', value: { ...storedData(), interviews: [{ id: 'fictif' }] } },
    { name: 'identifiants dupliqués', value: { ...storedData(), interviews: [interview(), interview()] } },
    { name: 'champ racine inconnu', value: { ...storedData(), future: true } },
    { name: 'champ profil inconnu', value: { ...storedData(), profile: { ...profile(), future: true } } },
    { name: 'champ entretien inconnu', value: { ...storedData(), interviews: [{ ...interview(), future: true }] } },
  ];

  const unsafe: { name: string; raw: string; expected: StorageReadResult }[] = [
    ...['', ' ', '{invalide', '{"version":1,}'].map((raw) => ({
      name: `JSON illisible ${JSON.stringify(raw)}`, raw,
      expected: { status: 'invalid-data', reason: 'invalid-json' } as const,
    })),
    ...invalidDocuments.map(({ name, value }) => ({
      name, raw: JSON.stringify(value),
      expected: { status: 'invalid-data', reason: 'invalid-format' } as const,
    })),
    ...[0, 2, 99, -1].map((version) => ({
      name: `version inconnue ${version}`, raw: JSON.stringify({ ...storedData(), version }),
      expected: { status: 'unknown-version', version } as const,
    })),
  ];

  describe.each(writes)('Protection lors de la sauvegarde $name', ({ run }) => {
    it.each(unsafe)('bloque $name sans tenter de réécriture', ({ raw, expected }) => {
      memory.entries.set(JOBVIEW_STORAGE_KEY, raw);
      expect(service.load()).toEqual(expected);
      expect(run(service)).toEqual({ status: 'blocked', read: expected });
      expect(memory.setItem).not.toHaveBeenCalled();
      expect(memory.entries.get(JOBVIEW_STORAGE_KEY)).toBe(raw);
    });

    it('bloque une lecture refusée, conserve les données puis permet une nouvelle tentative', () => {
      const raw = JSON.stringify(storedData());
      memory.entries.set(JOBVIEW_STORAGE_KEY, raw);
      memory.getItem.mockImplementation(() => { throw new DOMException('Refus simulé', 'SecurityError'); });
      expect(service.load()).toEqual({ status: 'access-denied' });
      expect(run(service)).toEqual({ status: 'blocked', read: { status: 'access-denied' } });
      expect(memory.setItem).not.toHaveBeenCalled();
      expect(memory.entries.get(JOBVIEW_STORAGE_KEY)).toBe(raw);
      memory.getItem.mockImplementation((key) => memory.entries.get(key) ?? null);
      expect(run(service).status).toBe('saved');
    });

    it('bloque aussi un contenu devenu illisible depuis la dernière lecture réussie', () => {
      memory.entries.set(JOBVIEW_STORAGE_KEY, JSON.stringify(storedData()));
      expect(service.load().status).toBe('ready');
      memory.entries.set(JOBVIEW_STORAGE_KEY, 'contenu illisible');
      expect(run(service).status).toBe('blocked');
      expect(memory.setItem).not.toHaveBeenCalled();
      expect(memory.entries.get(JOBVIEW_STORAGE_KEY)).toBe('contenu illisible');
    });

    describe.each([
      { name: 'saturation', error: new DOMException('Quota simulé', 'QuotaExceededError'), status: 'quota-exceeded' },
      { name: 'accès refusé', error: new DOMException('Refus simulé', 'SecurityError'), status: 'access-denied' },
      { name: 'autre erreur', error: new Error('Échec simulé'), status: 'write-failed' },
    ])('Échec : $name', ({ error, status }) => {
      it.each([false, true])('conserve exactement le stockage (déjà initialisé : %s)', (initialized) => {
        const raw = initialized ? JSON.stringify(storedData()) : undefined;
        if (raw !== undefined) { memory.entries.set(JOBVIEW_STORAGE_KEY, raw); }
        const before = new Map(memory.entries);
        memory.setItem.mockImplementationOnce(() => { throw error; });
        expect(run(service)).toEqual({ status });
        expect(memory.setItem).toHaveBeenCalledTimes(1);
        expect(memory.entries).toEqual(before);
        expect(newService().load()).toEqual(initialized
          ? { status: 'ready', data: storedData() }
          : { status: 'empty' });
        expect(run(service).status).toBe('saved');
      });
    });
  });

  it.each([null, [], {}, { ...profile(), skills: [1] }, { ...profile(), future: true }])(
    'refuse un profil invalide à la sauvegarde : %j', (value) => {
      memory.entries.set(JOBVIEW_STORAGE_KEY, JSON.stringify(storedData()));
      expect(service.saveProfile(value as unknown as Profile)).toEqual({ status: 'invalid-input' });
      expect(memory.setItem).not.toHaveBeenCalled();
      expect(memory.entries.get(JOBVIEW_STORAGE_KEY)).toBe(JSON.stringify(storedData()));
    },
  );

  it.each([
    null, [], {}, { ...interview(), id: '' }, { ...interview(), company: null },
    { ...interview(), conditionsRating: NaN }, { ...interview(), compatibilityRating: Infinity },
    { ...interview(), conditionsRating: '0' }, { ...interview(), feeling: 'Inconnu' },
    { ...interview(), future: true },
  ])('refuse un entretien invalide à la sauvegarde : %j', (value) => {
    const raw = JSON.stringify(storedData());
    memory.entries.set(JOBVIEW_STORAGE_KEY, raw);
    expect(service.addInterview(value as unknown as Interview)).toEqual({ status: 'invalid-input' });
    expect(memory.setItem).not.toHaveBeenCalled();
    expect(memory.entries.get(JOBVIEW_STORAGE_KEY)).toBe(raw);
  });
});

describe('Obtention du stockage', () => {
  beforeEach(() => { TestBed.resetTestingModule(); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('capture un getter localStorage refusé avec le fournisseur par défaut', () => {
    const getter = vi.spyOn(globalThis, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Refus simulé', 'SecurityError');
    });
    try {
      const service = TestBed.inject(JobViewStorage);
      expect(service.load()).toEqual({ status: 'access-denied' });
      for (const { run } of writes) {
        expect(run(service)).toEqual({ status: 'blocked', read: { status: 'access-denied' } });
      }
    } finally {
      getter.mockRestore();
    }
  });

  it('remonte aussi un stockage absent de la plateforme', () => {
    vi.stubGlobal('localStorage', undefined);
    const service = TestBed.inject(JobViewStorage);
    expect(service.load()).toEqual({ status: 'access-denied' });
    expect(service.saveProfile(profile())).toEqual({ status: 'blocked', read: { status: 'access-denied' } });
  });

  it('utilise le localStorage jsdom via le fournisseur par défaut et une nouvelle instance', () => {
    // jsdom storage is isolated test data; no real browser profile is accessed.
    globalThis.localStorage.removeItem(JOBVIEW_STORAGE_KEY);
    try {
      const service = TestBed.inject(JobViewStorage);
      expect(service.saveProfile(profile()).status).toBe('saved');
      expect(service.addInterview(interview()).status).toBe('saved');
      expect(newService().load()).toEqual({ status: 'ready', data: storedData() });
    } finally {
      globalThis.localStorage.removeItem(JOBVIEW_STORAGE_KEY);
    }
  });
});
