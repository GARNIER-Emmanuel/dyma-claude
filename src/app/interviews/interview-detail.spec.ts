import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { InterviewDetail } from './interview-detail';

describe('Détail de l’entretien', () => {
  it('consulte toutes les informations de la tranche et revient à la liste', async () => {
    const fixture = TestBed.createComponent(InterviewDetail);
    fixture.componentRef.setInput('interview', { id: 'a', company: '<script>exemple</script>', position: 'Poste fictif', contract: 'CDI', date: '2026-10-19', conditionsRating: 0 });
    await fixture.whenStable();
    const text: string = fixture.nativeElement.textContent;
    for (const value of ['<script>exemple</script>', 'Poste fictif', 'CDI', '19/10/2026', '0 / 10', 'Non noté', 'Non renseigné']) expect(text).toContain(value);
    expect(fixture.nativeElement.querySelector('script')).toBeNull();
    const closed = vi.fn(); fixture.componentInstance.closed.subscribe(closed);
    fixture.nativeElement.querySelector('button').click(); expect(closed).toHaveBeenCalledOnce();
  });
});
