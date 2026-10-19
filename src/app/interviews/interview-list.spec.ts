import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { InterviewList } from './interview-list';

describe('Liste des entretiens', () => {
  it('distingue l’absence d’entretien d’une lecture impossible', async () => {
    const fixture = TestBed.createComponent(InterviewList); fixture.componentRef.setInput('interviews', []);
    await fixture.whenStable(); expect(fixture.nativeElement.textContent).toContain('Votre prochain entretien commence ici');
    const create = vi.fn(); fixture.componentInstance.create.subscribe(create);
    fixture.nativeElement.querySelector('.empty-state button').click(); expect(create).toHaveBeenCalledOnce();
    fixture.componentRef.setInput('available', false); await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('ne peuvent pas être chargés');
    expect(fixture.nativeElement.textContent).not.toContain('Votre prochain entretien commence ici');
  });
  it('affiche les deux entretiens indépendants et leurs notes comme texte', async () => {
    const fixture = TestBed.createComponent(InterviewList);
    const interview = { id: 'a', company: '<img src=x onerror=alert(1)>', position: 'Poste', date: '0001-01-01', contract: 'CDI', conditionsRating: 0 };
    fixture.componentRef.setInput('interviews', [interview, { ...interview, id: 'b' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('li')).toHaveLength(2);
    expect(fixture.nativeElement.textContent).toContain('0 / 10');
    expect(fixture.nativeElement.textContent).toContain('Non noté');
    expect(fixture.nativeElement.textContent).toContain('01/01/0001');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    const open = vi.fn(); fixture.componentInstance.opened.subscribe(open);
    fixture.nativeElement.querySelector('li button').click(); expect(open).toHaveBeenCalledWith('a');
  });
});
