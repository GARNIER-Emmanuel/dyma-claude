import { Component, input, output } from '@angular/core';
import type { Interview } from './interview';

@Component({ selector: 'app-interview-list', templateUrl: './interview-list.html', styleUrl: './interview-list.css' })
export class InterviewList {
  readonly interviews = input.required<readonly Interview[]>();
  readonly available = input(true);
  readonly opened = output<string>();
  readonly create = output<void>();
}
