import { Component, OnInit } from '@angular/core';
import { ApiService, NameEntry } from '../api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDTO } from '../shared/form-models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css', '../shared/top-nav.css'],
})
export class AdminPanelComponent implements OnInit {
  names: NameEntry[] = [];    // list of names
  forms: FormDTO[] = []; // list of forms
  adminUsername = '';
  adminPassword = '';
  showCreateForm = false;
  newFormTitle = "";
  selectedFormForDelete: FormDTO | null = null;
  deleteConfirmInput: string = "";
  deleteError: string | null = null;
    
  constructor(private api: ApiService, private router: Router) { }

  isLoggedIn$!: Observable<boolean>;

  ngOnInit(): void {
    this.isLoggedIn$ = this.api.token$.pipe(map(token => !!token));
    this.api.token$.subscribe(token => {
      if (token) {
        this.loadNames(); // load names when admin is logged in
        this.loadForms(); // load forms when admin is logged in
      } else {
        this.names = [];  // clear names if logged out
        this.forms = [];  // clear forms if logged out
      }
    });
  }

  // load all names from backend
  loadNames(): void {
    this.api.getNames().subscribe({
      next: data => this.names = data,
      error: err => console.error('Failed  to load names', err)
    });
  }

  delete(id: number): void {
    this.api.deleteName(id).subscribe({
      next: () => {
        // Remove from list in the UI
        console.log("Delete clicked:", id);
        this.names = this.names.filter(n => n.id !== id);
      },
      error: err => {
        console.error("Delete failed", err);
      }
    });
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

  loadForms(): void {
    this.api.getAllForms().subscribe({
      next: forms => this.forms = forms,
      error: err => console.error('Failed to load forms', err)
    });
  }
  startCreateForm() {
    this.router.navigateByUrl('/form-creation');
  }
  deleteForm(form: FormDTO) {
    this.api.deleteForm(form.id).subscribe({
      next: () => {
        // Close dialog and refresh list
        this.selectedFormForDelete = null;
        this.loadForms();
      },
      error: (err) => {
        this.deleteError = "Failed to delete form: " + (err.error ?? err.message);
      }
    });
  }

  // createForm() {
  //   if (!this.newFormTitle.trim()) {
  //     alert("Form title cannot be empty.");
  //     return;
  //   }

  //   this.api.createForm(this.newFormTitle).subscribe({
  //     next: (result) => {
  //       console.log("Form created:", result);
  //       this.showCreateForm = false;
  //       this.newFormTitle = "";
  //       this.loadForms();   // refresh list
  //     },
  //     error: (err) => {
  //       console.error("Error creating form:", err);
  //       alert("Failed to create form.");
  //     }
  //   });
  // }

  // cancelCreate() {
  //   this.showCreateForm = false;
  //   this.newFormTitle = "";
  // }
  // openDeleteDialog(form: FormDTO) {
  //   this.selectedFormForDelete = form;
  //   this.deleteConfirmInput = "";
  //   this.deleteError = null;
  // }
  // confirmDelete() {
  //   if (!this.selectedFormForDelete) return;

  //   const expected = `delete ${this.selectedFormForDelete.title}`;

  //   if (this.deleteConfirmInput.trim() !== expected) {
  //     this.deleteError = `You must type exactly: "${expected}"`;
  //     return;
  //   }

  //   this.api.deleteForm(this.selectedFormForDelete.id).subscribe({
  //     next: () => {
  //       // Close dialog and refresh list
  //       this.selectedFormForDelete = null;
  //       this.loadForms();
  //     },
  //     error: (err) => {
  //       this.deleteError = "Failed to delete form: " + (err.error ?? err.message);
  //     }
  //   });
  // }
  // cancelDelete() {
  //   this.selectedFormForDelete = null;
  //   this.deleteConfirmInput = "";
  //   this.deleteError = null;
  // }

}
