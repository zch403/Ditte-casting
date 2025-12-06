import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormDTO } from '../shared/form-models';

@Component({
  selector: 'app-public-submission',
  standalone: false,
  templateUrl: './public-submission.component.html',
  styleUrls: ['./public-submission.component.css'],
})
export class PublicSubmissionComponent implements OnInit {
  name: string = '';                  // input value
  forms: FormDTO[] = [];               // list of forms
  constructor(private api: ApiService) {}

  ngOnInit(): void {
  this.loadActiveForms(); // load forms when admin is logged in
  }
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

  loadActiveForms(): void {
    this.api.getActiveForms().subscribe({
      next: forms => this.forms = forms,
      error: err => console.error('Failed to load forms', err)
    });
  }

}
