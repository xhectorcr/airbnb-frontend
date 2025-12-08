import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  nombre: string;
  email: string;
  esAdmin: boolean;
  telefono?: string;
  propiedadesCount?: number;
  activo?: boolean;
  direccion?: string; // Add this
}

export interface LoginResponse {
  usuario: User;
  token: string;
  expiresIn: number;
}

export interface RegisterResponse {
  message: string;
  usuarioId: number;
  nextStep: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5105/api/Auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(savedUser));
        } catch (e) {
          console.error('Error al cargar usuario guardado', e);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.usuario));
            localStorage.setItem('authToken', response.token); // Guardar token
          }
          this.currentUserSubject.next(response.usuario);
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: { nombre: string, email: string, password: string, telefono?: string, direccion?: string }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData).pipe(
      catchError(error => {
        console.error('Register error', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateProfile(data: { nombre: string; email: string; telefono?: string; direccion?: string }): Observable<User> {
    const usersUrl = this.apiUrl.replace('/Auth', '/Usuarios/profile');
    return this.http.put<User>(usersUrl, data).pipe(
      tap(updatedUser => {
        if (isPlatformBrowser(this.platformId)) {
          // Merge with existing user to keep token, or just update user part
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          // Note: Token usually doesn't change on profile update unless encoded claims change significantly and backend re-issues it.
          // If backend only returns User, we keep the old token.
        }
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    const usersUrl = this.apiUrl.replace('/Auth', '/Usuarios');
    return this.http.delete<void>(`${usersUrl}/${id}`);
  }
}
