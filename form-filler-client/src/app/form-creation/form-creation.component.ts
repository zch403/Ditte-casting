import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormDTO, FormFieldDTO, ConditionDTO, ConditionTargetDTO } from '../shared/form-models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-creation',
  standalone: false,
  templateUrl: './form-creation.component.html',
  styleUrls: ['./form-creation.component.css', '../shared/top-nav.css'],
})
export class FormCreationComponent implements OnInit {
  formGroup: FormGroup;
  isLoggedIn$!: Observable<boolean>;

  adminUsername = '';
  adminPassword = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    // Initialize form with title and an empty fields array
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      fields: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.api.token$.pipe(map(token => !!token));
  }

  // -----------------------
  // Reactive Form Helpers
  // -----------------------
  get fields(): FormArray {
    return this.formGroup.get('fields') as FormArray;
  }

  newField(): FormGroup {
    return this.fb.group({
      label: ['', Validators.required],
      type: ['', Validators.required],
      isRequired: [false]
    });
  }

  addField(): void {
    this.fields.push(this.newField());
  }

  removeField(index: number): void {
    this.fields.removeAt(index);
  }
  get fieldGroups(): FormGroup[] {
    return (this.formGroup.get('fields') as FormArray).controls as FormGroup[];
  }
  // -----------------------
  // Login / Logout
  // -----------------------
  loginAdmin(): void {
    this.api.login(this.adminUsername, this.adminPassword).subscribe({
      next: () => console.log('Admin logged in'),
      error: err => console.error('Login failed', err)
    });
  }

  logoutAdmin(): void {
    this.api.logout();
    console.log('Logged out');
  }

  // -----------------------
  // Submit Form
  // -----------------------
  submitForm(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const formDTO = this.formGroup.value;
    this.api.createForm(formDTO).subscribe({
      next: res => {
        console.log('Form created', res);
        this.router.navigate(['/admin']);
      },
      error: err => console.error('Form creation failed', err)
    });
  }
}
