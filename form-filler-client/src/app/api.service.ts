import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export interface NameEntry {
  id: number;
  name: string;  // must match backend property name
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:5068/api/names';
  private authUrl = 'http://localhost:5068/api/auth/login';
  private tokenKey = 'token';
  constructor(private http: HttpClient) { }

  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();

  getToken() {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.tokenSubject.next(token);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.tokenSubject.next(null);
  }

  /** POST a new name (any user can submit) */
  submitName(name: string): Observable<NameEntry> {
    return this.http.post<NameEntry>(this.apiUrl, { name });
  }

  /** GET all names (admin only) */
  getNames(): Observable<NameEntry[]> {
    if (!this.isLoggedIn()) {
      throw new Error('Admin token is not set');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get<NameEntry[]>(this.apiUrl, { headers });
  }

  /** Admin login */
  login(username: string, password: string): Observable<void> {
    return this.http.post<{ token: string }>(this.authUrl, { username, password }).pipe(
      tap(res => {
        // Save token to localStorage
        this.saveToken(res.token);
      }),
      map(() => {}) // convert observable to Observable<void>
    );
  }
  deleteName(id: number): Observable<void> {
    if (!this.isLoggedIn()) {
      throw new Error('Admin token is not set');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete<void>(`http://localhost:5068/api/names/${id}`, { headers });
  }
}