import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import type { Profile } from './profile';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-form.html',
})
export class ProfileForm {
  readonly profile = input<Profile | null>(null);
  readonly blocked = input(false);
  readonly submitted = output<Profile>();
  readonly changed = output<void>();
  readonly form = new FormGroup({
    skills: new FormControl('', { nonNullable: true }),
    desiredJob: new FormControl('', { nonNullable: true }),
    desiredSalaryRange: new FormControl('', { nonNullable: true }),
    workingHours: new FormControl('', { nonNullable: true }),
    remoteWork: new FormControl('', { nonNullable: true }),
    location: new FormControl('', { nonNullable: true }),
    desiredContract: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const profile = this.profile();
      if (!this.form.dirty) {
        if (profile) this.markSaved(profile);
        else this.form.reset();
      }
    });
  }

  markSaved(profile: Profile): void {
    this.form.reset({ ...profile, skills: profile.skills.join('\n') });
  }

  submit(): void {
    if (this.blocked()) return;
    const value = this.form.getRawValue();
    this.submitted.emit({
      ...value,
      skills: value.skills.split(/\r?\n/).map((skill) => skill.trim()).filter(Boolean),
    });
  }
}
