import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormDTO, FormFieldDTO, ConditionDTO, ConditionTargetDTO } from '../shared/form-models';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-form-creation',
  standalone: false,
  templateUrl: './form-creation.component.html',
  styleUrls: ['./form-creation.component.css', '../shared/top-nav.css'],
})
export class FormCreationComponent implements OnInit {
  adminUsername = '';
  adminPassword = '';
  fieldErrorMessage: string = '';
  formErrorMessage: string = '';
  form : FormDTO = {
    id: 0,
    title: "",
    isActive: false,
    fields: []
  };
  showCondForm : boolean = false
  showCondFormIndex : number = 0
  showFieldCreation : boolean = false
  curField: FormFieldDTO = {
    label: "",
    type: "",
    isRequired: false,
    conditionsWhereTrigger: []
  };
  curCondition: ConditionDTO = {
    operator: "Equals",
    value: "",
    targets: []
  };
  curConditionTarget: ConditionTargetDTO = {
    fieldOrderIndex: -1
  };

  constructor(private api: ApiService, private router: Router) { }
  isLoggedIn$!: Observable<boolean>;
  
  ngOnInit(): void {
    this.isLoggedIn$ = this.api.token$.pipe(map(token => !!token));
  }
  loginAdmin(): void {
    this.api.login(this.adminUsername, this.adminPassword).subscribe({
      next: () => {
        console.log('Admin logged in, token saved');
      },
      error: err => console.error('Login failed', err)
    });
  }
  logoutAdmin(): void {
    this.api.logout();
    console.log('Logged out');
  }
  removeField(i: number): void {
    var fs = this.form.fields
    // this.form.fields = fs.splice(0, i).concat(fs.splice(i+1, fs.length))
    this.form.fields = fs.splice(i, 1)
  }
  addField(): void {
    // Reset message
    this.fieldErrorMessage = '';

    // Validate curField
    if (!this.curField.label?.trim() || !this.curField.type?.trim()) {
      this.fieldErrorMessage = 'Field must have a label and type.';
      return; // don't add
    }

    if (this.curField.minLength != null && this.curField.minLength! <= 0) {
      this.fieldErrorMessage = 'Minimum length cannot be negative.';
      return; // don't add
    }

    if (this.curField.maxLength != null && !this.curField.maxLength && this.curField.maxLength! < this.curField.minLength!) {
      this.fieldErrorMessage = 'Maximum length cannot be smaller than minimum length.';
      return; // don't add
    }

    if (this.curField.maxValue != null && !this.curField.maxValue && this.curField.maxValue! < this.curField.minValue!) {
      this.fieldErrorMessage = 'Maximum value cannot be smaller than minimum value.';
      return; // don't add
    }

    // Clone curField to avoid reference issues
    const newField: FormFieldDTO = { ...this.curField, conditionsWhereTrigger: [...this.curField.conditionsWhereTrigger] };
    this.form.fields.push(newField);

    // Reset curField and hide the creation form
    this.curField = {
      label: "",
      type: "",
      isRequired: false,
      conditionsWhereTrigger: []
    };
    this.showFieldCreation = false;
  }
  submitForm(): void {
    // Reset message
    this.formErrorMessage = '';

    // Validate form
    if (!this.form.title?.trim()) {
      this.formErrorMessage = 'Form must have a title.';
      return;
    }

    // --- Clone form safely ---
    const formToSubmit: FormDTO = {
      ...this.form,
      fields: this.form.fields.map(f => ({
        ...f,
        conditionsWhereTrigger: f.conditionsWhereTrigger?.map(c => ({
          ...c,
          targets: c.targets?.map(t => ({ ...t })) || []
        })) || []
      }))
    };

    this.api.createForm(formToSubmit).subscribe({
      next: () => {
        console.log("Form created!");

        // Reset the form
        this.form = {
          id: -1,
          title: "",
          isActive: false,
          fields: []
        };

        // Navigate back to admin dashboard
        this.router.navigate(['/admin']);
      },
      error: err => console.error("Form creation failed", err.error)
    });
  }
  addCondition(fieldIndex: number): void {
    const field = this.form.fields[fieldIndex];
    if (!this.curCondition?.value?.trim()) {
      this.fieldErrorMessage = 'Condition value cannot be empty.';
      return;
    }

    if (!field.conditionsWhereTrigger) field.conditionsWhereTrigger = [];
    field.conditionsWhereTrigger.push({ 
      ...this.curCondition,
      targets: this.curCondition.targets?.map(t => ({ ...t })) || []
    });

    // Reset current condition
    this.curCondition = { operator: 'Equals', value: '', targets: [] };
    this.showCondForm = false;
  }

  removeCondition(fieldIndex: number, condIndex: number): void {
    this.form.fields[fieldIndex].conditionsWhereTrigger.splice(condIndex, 1);
  }

  addConditionIndex(i : number) {
    this.curCondition.targets.push( { fieldOrderIndex: i } )
  }

  toggleTarget(index: number, event: any) {
    if (!this.curCondition.targets) this.curCondition.targets = [];

    if (event.target.checked) {
      // Add target
      this.curCondition.targets.push({ fieldOrderIndex: index });
    } else {
      // Remove target
      this.curCondition.targets = this.curCondition.targets.filter(
        t => t.fieldOrderIndex !== index
      );
    }
  }
  isTargetChecked(fi: number): boolean {
    return this.curCondition.targets?.some(t => t.fieldOrderIndex === fi) ?? false;
  }

  conditionTargetsAsList(cond: ConditionDTO) {
    return cond.targets.map(t => t.fieldOrderIndex)
  }
}
