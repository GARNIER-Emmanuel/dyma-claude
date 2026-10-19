import { Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { InterviewDraft } from './interview';
import { isValidFeeling, validateInterview, type InterviewValidationErrors } from './interview-validation';

@Component({
  selector: 'app-interview-form',
  imports: [ReactiveFormsModule],
  templateUrl: './interview-form.html',
})
export class InterviewForm {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly blocked = input(false);
  readonly submitted = output<InterviewDraft>();
  readonly changed = output<void>();
  readonly cancelled = output<void>();
  readonly errors = signal<InterviewValidationErrors>({});
  readonly form = new FormGroup({
    company: new FormControl('', { nonNullable: true }),
    date: new FormControl('', { nonNullable: true }),
    position: new FormControl('', { nonNullable: true }),
    contract: new FormControl('', { nonNullable: true }),
    conditionsRating: new FormControl('', { nonNullable: true }),
    compatibilityRating: new FormControl('', { nonNullable: true }),
    feeling: new FormControl('', { nonNullable: true }),
  });

  error(field: keyof InterviewValidationErrors): string | null {
    const code = this.errors()[field];
    if (!code) return null;
    if (code === 'invalid-rating') return 'Saisissez une note entière entre 0 et 10, ou laissez ce champ vide.';
    if (code === 'invalid-date') return 'Saisissez une date réelle au format JJ/MM/AAAA (années 0001 à 9999).';
    if (code === 'invalid-feeling') return 'Choisissez l’un des ressentis proposés.';
    return ({ company: 'Indiquez l’entreprise.', date: 'Indiquez la date de l’entretien.', position: 'Indiquez le poste.', contract: 'Indiquez le contrat.' } as Partial<Record<keyof InterviewValidationErrors, string>>)[field] ?? null;
  }

  submit(): void {
    this.changed.emit();
    if (this.blocked()) return;
    const value = this.form.getRawValue();
    const date = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.date);
    const draft: InterviewDraft = {
      company: value.company, date: date ? `${date[3]}-${date[2]}-${date[1]}` : value.date,
      position: value.position, contract: value.contract,
      ...(value.conditionsRating.trim() === '' ? {} : { conditionsRating: Number(value.conditionsRating) }),
      ...(value.compatibilityRating.trim() === '' ? {} : { compatibilityRating: Number(value.compatibilityRating) }),
      ...(isValidFeeling(value.feeling) ? { feeling: value.feeling } : {}),
    };
    const errors = validateInterview(draft);
    if (value.date.trim() && !date) errors.date = 'invalid-date';
    if (value.feeling && !isValidFeeling(value.feeling)) errors.feeling = 'invalid-feeling';
    this.errors.set(errors);
    if (Object.keys(errors).length) {
      // Focus the first invalid native control; rendering of its message follows this event.
      const field = Object.keys(errors)[0];
      this.host.nativeElement.querySelector<HTMLElement>(`#interview-${field}`)?.focus();
      return;
    }
    this.submitted.emit(draft);
  }

  reset(): void {
    this.form.reset();
    this.errors.set({});
  }
}
