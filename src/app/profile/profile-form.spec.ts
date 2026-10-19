import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { ProfileForm } from './profile-form';

describe('Formulaire du profil', () => {
  it('soumet les sept informations sans imposer de champs obligatoires', async () => {
    const fixture = TestBed.createComponent(ProfileForm);
    await fixture.whenStable();
    const submit = vi.fn();
    fixture.componentInstance.submitted.subscribe(submit);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
    expect(submit).toHaveBeenCalledWith({ skills: [], desiredJob: '', desiredContract: '', desiredSalaryRange: '', workingHours: '', remoteWork: '', location: '' });
  });

  it('convertit les lignes de compétences et conserve les textes libres', async () => {
    const fixture = TestBed.createComponent(ProfileForm);
    await fixture.whenStable();
    fixture.componentInstance.form.setValue({ skills: ' Angular \r\n\nJava\n', desiredJob: 'Développeur', desiredContract: 'CDI', desiredSalaryRange: 'À discuter', workingHours: '35 h', remoteWork: '2 jours', location: 'Ville fictive' });
    const submit = vi.fn();
    fixture.componentInstance.submitted.subscribe(submit);
    fixture.componentInstance.submit();
    expect(submit.mock.calls[0][0]).toEqual({ skills: ['Angular', 'Java'], desiredJob: 'Développeur', desiredContract: 'CDI', desiredSalaryRange: 'À discuter', workingHours: '35 h', remoteWork: '2 jours', location: 'Ville fictive' });
  });

  it('hydrate le profil sans écraser un brouillon modifié lors d’une relecture', async () => {
    const fixture = TestBed.createComponent(ProfileForm);
    const profile = { skills: ['Angular'], desiredJob: 'Développeur', desiredContract: '', desiredSalaryRange: '', workingHours: '', remoteWork: '', location: '' };
    fixture.componentRef.setInput('profile', profile);
    await fixture.whenStable();
    expect(fixture.componentInstance.form.controls.skills.value).toBe('Angular');
    fixture.componentInstance.form.controls.desiredJob.setValue('Brouillon');
    fixture.componentInstance.form.markAsDirty();
    fixture.componentRef.setInput('profile', { ...profile, desiredJob: 'Autre' });
    await fixture.whenStable();
    expect(fixture.componentInstance.form.controls.desiredJob.value).toBe('Brouillon');
  });

  it('ne soumet pas lorsque le stockage est bloqué', async () => {
    const fixture = TestBed.createComponent(ProfileForm);
    fixture.componentRef.setInput('blocked', true);
    await fixture.whenStable();
    const submit = vi.fn(); fixture.componentInstance.submitted.subscribe(submit);
    fixture.componentInstance.submit();
    expect(submit).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('button[type=submit]').disabled).toBe(true);
  });
});
