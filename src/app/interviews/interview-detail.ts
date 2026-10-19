import { Component, input, output } from '@angular/core';
import type { Interview } from './interview';

@Component({ selector: 'app-interview-detail', templateUrl: './interview-detail.html' })
export class InterviewDetail {
  readonly interview = input.required<Interview>();
  readonly closed = output<void>();
}
