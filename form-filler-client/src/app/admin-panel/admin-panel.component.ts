import { Component, OnInit } from '@angular/core';
import { ApiService, NameEntry } from '../api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  names: NameEntry[] = [];    // list of names
  adminUsername = '';
  adminPassword = '';
  
  constructor(private api: ApiService) { }

  isLoggedIn$!: Observable<boolean>;

  ngOnInit(): void {
    this.isLoggedIn$ = this.api.token$.pipe(map(token => !!token));
    this.api.token$.subscribe(token => {
      if (token) {
        this.loadNames(); // load names when admin is logged in
      } else {
        this.names = [];  // clear names if logged out
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
}
