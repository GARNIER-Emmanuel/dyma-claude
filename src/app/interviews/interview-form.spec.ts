import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { InterviewForm } from './interview-form';

const valid = { company: 'Société fictive', date: '19/10/2026', position: 'Développeur', contract: 'CDI', conditionsRating: '', compatibilityRating: '', feeling: '' };

describe('Formulaire d’entretien', () => {
  it('refuse une saisie vide et place le focus sur le premier champ invalide', async () => {
    const fixture = TestBed.createComponent(InterviewForm); await fixture.whenStable();
    document.body.appendChild(fixture.nativeElement);
    const submit = vi.fn(); fixture.componentInstance.submitted.subscribe(submit);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(submit).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Indiquez l’entreprise.');
    expect(fixture.nativeElement.querySelectorAll('[aria-invalid=true]')).toHaveLength(4);
    expect(document.activeElement?.id).toBe('interview-company');
    fixture.nativeElement.remove();
  });

  it.each(['31/02/2026', '00/10/2026', '01/01/0000', '29/02/1900', '2026-10-19', '1/1/2026', '19/10/2026\n'])('refuse la date %j', async (date) => {
    const fixture = TestBed.createComponent(InterviewForm); await fixture.whenStable();
    fixture.componentInstance.form.setValue({ ...valid, date });
    fixture.componentInstance.submit();
    expect(fixture.componentInstance.errors().date).toBe('invalid-date');
  });

  it.each([['01/01/0001', '0001-01-01'], ['31/12/9999', '9999-12-31'], ['29/02/2000', '2000-02-29']])('convertit %s sans fuseau horaire', async (date, expected) => {
    const fixture = TestBed.createComponent(InterviewForm); await fixture.whenStable();
    fixture.componentInstance.form.setValue({ ...valid, date });
    const submit = vi.fn(); fixture.componentInstance.submitted.subscribe(submit);
    fixture.componentInstance.submit();
    expect(submit.mock.calls[0][0].date).toBe(expected);
  });

  it.each(['-1', '11', '2.5', 'NaN', 'abc', 'Infinity'])('refuse la note %s sans la convertir en absence', async (rating) => {
    const fixture = TestBed.createComponent(InterviewForm); await fixture.whenStable();
    fixture.componentInstance.form.setValue({ ...valid, conditionsRating: rating, compatibilityRating: rating });
    fixture.componentInstance.submit();
    expect(fixture.componentInstance.errors()).toEqual({ conditionsRating: 'invalid-rating', compatibilityRating: 'invalid-rating' });
  });

  it('soumet zéro, dix et feeling sans profil et conserve une note absente', async () => {
    const fixture = TestBed.createComponent(InterviewForm); await fixture.whenStable();
    const submit = vi.fn(); fixture.componentInstance.submitted.subscribe(submit);
    fixture.componentInstance.form.setValue({ ...valid, conditionsRating: '0', feeling: 'Super bon' });
    fixture.componentInstance.submit();
    expect(submit.mock.calls[0][0]).toEqual({ company: valid.company, date: '2026-10-19', position: valid.position, contract: 'CDI', conditionsRating: 0, feeling: 'Super bon' });
    fixture.componentInstance.form.controls.compatibilityRating.setValue('10');
    fixture.componentInstance.submit();
    expect(submit.mock.calls[1][0].compatibilityRating).toBe(10);
    fixture.componentInstance.reset();
    expect(fixture.componentInstance.form.controls.company.value).toBe('');
  });

  it('refuse un feeling inconnu et une soumission bloquée', async () => {
    const fixture = TestBed.createComponent(InterviewForm); await fixture.whenStable();
    fixture.componentInstance.form.setValue({ ...valid, feeling: 'Autre' });
    fixture.componentInstance.submit(); expect(fixture.componentInstance.errors().feeling).toBe('invalid-feeling');
    fixture.componentRef.setInput('blocked', true); await fixture.whenStable();
    const submit = vi.fn(); fixture.componentInstance.submitted.subscribe(submit);
    fixture.componentInstance.form.controls.feeling.setValue('OK'); fixture.componentInstance.submit();
    expect(submit).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('button[type=submit]').disabled).toBe(true);
  });
});
