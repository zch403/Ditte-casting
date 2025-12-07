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
    return this.fb.group(
      {
        label: ['', Validators.required],
        type: ['', Validators.required],
        isRequired: [false],
        conditions: this.fb.array([]),

        // type-specific settings
        minLength: [null],
        maxLength: [null],
        minValue: [null],
        maxValue: [null]
      },
      { validators: this.fieldValidator.bind(this) }
    );
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

  // Get the conditions FormArray for a specific field
  getConditions(fieldIndex: number): FormArray {
    return this.fields.at(fieldIndex).get('conditions') as FormArray;
  }
  
  newCondition(): FormGroup {
    return this.fb.group(
      {
        operator: ['', Validators.required],
        value: ['', Validators.required],
        targets: this.fb.array([])
      },
      { validators: this.conditionValidator.bind(this) }
    );
  }

  // Add a condition to a specific field
  addConditionToField(fieldIndex: number): void {
    this.getConditions(fieldIndex).push(this.newCondition());
  }

  // Remove a condition
  removeCondition(fieldIndex: number, conditionIndex: number): void {
    this.getConditions(fieldIndex).removeAt(conditionIndex);
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

  fieldValidator(group: FormGroup) {
    const type = group.get('type')?.value;

    const minLength = group.get('minLength')?.value;
    const maxLength = group.get('maxLength')?.value;

    const minValue = group.get('minValue')?.value;
    const maxValue = group.get('maxValue')?.value;

    const errors: any = {};

    if (type === 'text') {
      if (minLength != null && minLength < 0) {
        errors.minLengthInvalid = true;
      }
      if (
        minLength != null &&
        maxLength != null &&
        maxLength < minLength
      ) {
        errors.maxLessThanMin = true;
      }
    }

    if (type === 'number') {
      if (
        minValue != null &&
        maxValue != null &&
        maxValue < minValue
      ) {
        errors.maxValLessThanMinVal = true;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
  conditionValidator(group: FormGroup) {
    const errors: any = {};
    return Object.keys(errors).length > 0 ? errors : null;
  }
}
