import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-public-submission',
  standalone: false,
  templateUrl: './public-submission.component.html',
  styleUrls: ['./public-submission.component.css'],
})
export class PublicSubmissionComponent {
  name: string = '';                  // input value
  constructor(private api: ApiService) {}
  // submit a new name
  submit() {
    const trimmedName = this.name.trim();
    if (!trimmedName) return;
    console.log("Sending name:", trimmedName);  // log the value
    this.api.submitName(trimmedName).subscribe({
      next: () => {
        this.name = '';     // clear input
      },
      error: err => console.error('Failed to submit name', err)
    });
  }
}
