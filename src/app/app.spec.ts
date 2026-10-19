import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';
import { JOBVIEW_STORAGE_ACCESS, JOBVIEW_STORAGE_KEY, JobViewStorage } from './storage/jobview-storage';
import { InterviewForm } from './interviews/interview-form';
import { ProfileForm } from './profile/profile-form';
import { By } from '@angular/platform-browser';
import type { StorageData } from './storage/storage-data';

describe('Santé de JobView', () => {
  it('démarre et affiche le titre', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toBe('JobView');
  });
});

describe('Parcours Angular et stockage réel simulé', () => {
  let raw: string | null;
  let fixture: ComponentFixture<App>;
  const getItem = vi.fn((_key: string): string | null => raw);
  const setItem = vi.fn((_key: string, value: string): void => { raw = value; });

  async function start(): Promise<void> {
    fixture = TestBed.createComponent(App); await fixture.whenStable();
  }
  function text(): string { return (fixture.nativeElement as HTMLElement).textContent ?? ''; }
  function input(id: string, value: string): void {
    const element = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
    element.value = value; element.dispatchEvent(new Event('input', { bubbles: true }));
  }
  async function create(): Promise<void> {
    fixture.componentInstance.show('create'); await fixture.whenStable();
    input('interview-company', 'Entreprise fictive'); input('interview-date', '19/10/2026');
    input('interview-position', 'Développeur'); input('interview-contract', 'CDI');
    input('interview-conditionsRating', '0');
  }
  async function submitInterview(): Promise<void> {
    fixture.nativeElement.querySelector('app-interview-form form').dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }
  function data(): StorageData { return JSON.parse(raw!) as StorageData; }

  beforeEach(() => {
    TestBed.resetTestingModule(); raw = null;
    getItem.mockReset().mockImplementation(() => raw);
    setItem.mockReset().mockImplementation((_key, value) => { raw = value; });
    TestBed.configureTestingModule({ imports: [App], providers: [{ provide: JOBVIEW_STORAGE_ACCESS, useValue: () => ({ getItem, setItem }) }] });
  });

  it('crée sans profil, confirme après écriture et relit le détail par une nouvelle instance', async () => {
    await start(); expect(text()).toContain('Votre prochain entretien commence ici');
    await create();
    setItem.mockImplementation((_key, value) => {
      expect(fixture.componentInstance.notice()).toBe('');
      expect(fixture.componentInstance.data()?.interviews).toHaveLength(0);
      expect(text()).not.toContain('Entretien enregistré.');
      raw = value;
    });
    await submitInterview();
    expect(text()).toContain('Entretien enregistré.');
    expect(fixture.componentInstance.screen()).toBe('detail');
    expect(data().profile).toBeNull();
    expect(data().interviews[0].conditionsRating).toBe(0);
    expect(data().interviews[0]).not.toHaveProperty('compatibilityRating');
    expect(text()).toContain('Non noté');
    expect(getItem.mock.calls.every((call) => call.length === 1 && call[0] === JOBVIEW_STORAGE_KEY)).toBe(true);
    fixture.destroy(); await start();
    expect(fixture.componentInstance.data()?.interviews).toHaveLength(1);
    fixture.nativeElement.querySelector('app-interview-list li button').click(); await fixture.whenStable();
    expect(text()).toContain('0 / 10'); expect(text()).toContain('Non noté');
  });

  it('conserve les deux entretiens et leurs notes après sauvegarde du profil', async () => {
    await start(); await create(); await submitInterview();
    await create(); await submitInterview();
    expect(data().interviews[0].id).not.toBe(data().interviews[1].id);
    const before = data().interviews;
    fixture.componentInstance.navigate('profile'); await fixture.whenStable();
    input('desiredJob', 'Développeur fictif'); input('skills', 'Angular\nJava');
    fixture.nativeElement.querySelector('app-profile-form form').dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(text()).toContain('Profil enregistré.'); expect(data().interviews).toEqual(before);
    expect(data().profile?.skills).toEqual(['Angular', 'Java']);
    fixture.destroy(); await start();
    expect(fixture.debugElement.query(By.directive(ProfileForm)).componentInstance.form.controls.desiredJob.value).toBe('Développeur fictif');
  });

  it('préserve les brouillons et efface une ancienne confirmation lors d’une saisie', async () => {
    await start(); await create();
    fixture.componentInstance.navigate('profile'); await fixture.whenStable(); input('desiredJob', 'Mon brouillon');
    fixture.componentInstance.navigate('interviews'); await fixture.whenStable();
    expect((fixture.nativeElement.querySelector('#interview-company') as HTMLInputElement).value).toBe('Entreprise fictive');
    fixture.componentInstance.navigate('profile'); await fixture.whenStable();
    expect((fixture.nativeElement.querySelector('#desiredJob') as HTMLInputElement).value).toBe('Mon brouillon');
    fixture.componentInstance.saveProfile({ skills: [], desiredJob: 'Mon brouillon', desiredSalaryRange: '', workingHours: '', remoteWork: '', location: '', desiredContract: '' });
    await fixture.whenStable(); expect(text()).toContain('Profil enregistré.');
    input('desiredJob', 'Autre brouillon'); await fixture.whenStable(); expect(fixture.componentInstance.notice()).toBe('');
  });

  it('ne tente aucune écriture pour une saisie invalide', async () => {
    await start(); await create(); input('interview-date', '31/02/2026');
    await submitInterview(); expect(setItem).not.toHaveBeenCalled(); expect(text()).toContain('date réelle');
  });

  it.each(['{', '{"version":2}', '{"version":1}'])('affiche une lecture non sûre %j sans vider ni écraser le contenu', async (value) => {
    raw = value; await start();
    expect(text()).toContain('Enregistrement indisponible');
    expect(text()).not.toContain('Votre prochain entretien commence ici');
    await create(); await submitInterview();
    expect(setItem).not.toHaveBeenCalled(); expect(raw).toBe(value);
    expect(fixture.nativeElement.querySelector('app-interview-form button[type=submit]').disabled).toBe(true);
  });

  it('explique le refus de lecture et réessaie sans écraser le brouillon', async () => {
    getItem.mockImplementation(() => { throw new DOMException('Refus fictif', 'SecurityError'); });
    await start(); fixture.componentInstance.navigate('profile'); await fixture.whenStable();
    input('desiredJob', 'À conserver');
    expect(text()).toContain('accès aux données');
    getItem.mockImplementation(() => null);
    fixture.componentInstance.reload(); await fixture.whenStable();
    expect(fixture.componentInstance.unsafe()).toBeNull();
    expect((fixture.nativeElement.querySelector('#desiredJob') as HTMLInputElement).value).toBe('À conserver');
  });

  it.each(['QuotaExceededError', 'SecurityError', 'Error'])('conserve saisie et données après un échec %s puis réussit la nouvelle tentative', async (errorName) => {
    await start(); await create();
    const error = errorName === 'Error' ? new Error('Échec fictif') : new DOMException('Échec fictif', errorName);
    setItem.mockImplementation(() => { throw error; });
    await submitInterview();
    expect(fixture.componentInstance.screen()).toBe('create'); expect(raw).toBeNull();
    expect(fixture.componentInstance.notice()).toBe(''); expect(text()).toContain('saisie est conservée');
    expect((fixture.nativeElement.querySelector('#interview-company') as HTMLInputElement).value).toBe('Entreprise fictive');
    const attempted = JSON.parse(setItem.mock.calls[0][1]) as StorageData;
    setItem.mockImplementation((_key, value) => { raw = value; }); await submitInterview();
    expect(data().interviews[0].id).toBe(attempted.interviews[0].id);
    expect(text()).toContain('Entretien enregistré.');
  });

  it('ne remplace pas un stockage devenu illisible entre chargement et écriture', async () => {
    await start(); await create(); raw = '{'; await submitInterview();
    expect(raw).toBe('{'); expect(setItem).not.toHaveBeenCalled();
    expect(fixture.componentInstance.unsafe()?.status).toBe('invalid-data');
    expect(fixture.componentInstance.notice()).toBe('');
    expect(fixture.debugElement.query(By.directive(InterviewForm)).componentInstance.form.controls.company.value).toBe('Entreprise fictive');
  });

  it('conserve le profil saisi après un quota dépassé sans fausse confirmation', async () => {
    await start(); fixture.componentInstance.navigate('profile'); await fixture.whenStable(); input('desiredJob', 'Mon profil fictif');
    setItem.mockImplementation(() => { throw new DOMException('Saturation fictive', 'QuotaExceededError'); });
    fixture.nativeElement.querySelector('app-profile-form form').dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(raw).toBeNull(); expect(fixture.componentInstance.notice()).toBe('');
    expect((fixture.nativeElement.querySelector('#desiredJob') as HTMLInputElement).value).toBe('Mon profil fictif');
    expect(text()).toContain('stockage du navigateur est saturé');
  });

  it('présente les refus invalid-input et duplicate-id sans succès', async () => {
    await start(); await create();
    const service = TestBed.inject(JobViewStorage);
    const save = vi.spyOn(service, 'addInterview').mockReturnValue({ status: 'invalid-input' });
    await submitInterview(); expect(text()).toContain('Vérifiez votre saisie');
    save.mockReturnValue({ status: 'duplicate-id' }); await submitInterview();
    expect(text()).toContain('identifiant'); expect(fixture.componentInstance.notice()).toBe('');
    expect(raw).toBeNull();
  });
});
