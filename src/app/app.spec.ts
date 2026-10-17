import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('Santé de JobView', () => {
  it('démarre et affiche le titre', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toBe('JobView');
  });
});
