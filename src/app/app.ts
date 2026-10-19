import { afterNextRender, Component, computed, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { ProfileForm } from './profile/profile-form';
import { InterviewForm } from './interviews/interview-form';
import { InterviewList } from './interviews/interview-list';
import { InterviewDetail } from './interviews/interview-detail';
import type { Profile } from './profile/profile';
import type { InterviewDraft } from './interviews/interview';
import { JobViewStorage } from './storage/jobview-storage';
import type { StorageData, StorageSaveResult, UnsafeStorageRead } from './storage/storage-data';
import { storageReadMessage, storageSaveMessage } from './storage/storage-messages';

@Component({
  selector: 'app-root',
  imports: [ProfileForm, InterviewForm, InterviewList, InterviewDetail],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly storage = inject(JobViewStorage);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly profileForm = viewChild(ProfileForm);
  private readonly interviewForm = viewChild(InterviewForm);
  private pendingId: string | null = null;
  readonly space = signal<'profile' | 'interviews'>('interviews');
  readonly screen = signal<'list' | 'create' | 'detail'>('list');
  readonly data = signal<StorageData | null>(null);
  readonly unsafe = signal<UnsafeStorageRead | null>(null);
  readonly saveError = signal('');
  readonly notice = signal('');
  readonly selectedId = signal<string | null>(null);
  readonly selected = computed(() => this.data()?.interviews.find((item) => item.id === this.selectedId()) ?? null);
  readonly error = computed(() => {
    const read = this.unsafe();
    return read ? storageReadMessage(read) : this.saveError();
  });

  constructor() { this.reload(); }

  reload(): void {
    const read = this.storage.load();
    this.clearFeedback();
    if (read.status === 'ready' || read.status === 'empty') {
      this.unsafe.set(null);
      this.data.set(read.status === 'ready' ? read.data : { version: 1, profile: null, interviews: [] });
    } else {
      this.unsafe.set(read);
      this.data.set(null);
    }
  }

  navigate(space: 'profile' | 'interviews'): void {
    this.space.set(space);
    this.clearFeedback();
    this.focus(space === 'profile' ? '#profile-heading' : this.heading());
  }

  show(screen: 'list' | 'create' | 'detail'): void {
    this.screen.set(screen);
    this.clearFeedback();
    this.focus(this.heading());
  }

  open(id: string): void { this.selectedId.set(id); this.show('detail'); }

  clearFeedback(): void { this.notice.set(''); this.saveError.set(''); }

  saveProfile(profile: Profile): void {
    this.clearFeedback();
    if (this.unsafe()) return;
    const result = this.storage.saveProfile(profile);
    if (this.accept(result)) {
      this.profileForm()?.markSaved(profile);
      this.notice.set('Profil enregistré.');
    }
  }

  addInterview(draft: InterviewDraft): void {
    this.clearFeedback();
    if (this.unsafe()) return;
    this.pendingId ??= crypto.randomUUID();
    const result = this.storage.addInterview({ ...draft, id: this.pendingId });
    if (this.accept(result)) {
      this.selectedId.set(this.pendingId);
      this.pendingId = null;
      this.interviewForm()?.reset();
      this.show('detail');
      this.notice.set('Entretien enregistré.');
    }
  }

  private accept(result: StorageSaveResult): boolean {
    if (result.status === 'saved') { this.data.set(result.data); return true; }
    if (result.status === 'blocked') this.unsafe.set(result.read);
    this.saveError.set(storageSaveMessage(result));
    return false;
  }

  private heading(): string {
    return this.screen() === 'create' ? '#interview-heading' : this.screen() === 'detail' ? '#detail-heading' : '#list-heading';
  }

  private focus(selector: string): void {
    afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>(selector)?.focus(), { injector: this.injector });
  }
}
