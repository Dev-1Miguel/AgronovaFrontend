import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AuthenticatedUser,
  AuthMessageResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly endpoint = `${environment.apiUrl}/auth`;
  private readonly userKey = 'user';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.endpoint}/login`, credentials, { withCredentials: true }).pipe(
      tap((response) => this.storeUser(response.user)),
      catchError((error) => {
        this.clearSession();
        return throwError(() => error);
      }),
    );
  }

  register(payload: RegisterRequest): Observable<AuthMessageResponse> {
    return this.http.post<AuthMessageResponse>(`${this.endpoint}/register`, payload, { withCredentials: true });
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<AuthMessageResponse> {
    return this.http.post<AuthMessageResponse>(`${this.endpoint}/forgot-password`, payload, { withCredentials: true });
  }

  resetPassword(payload: ResetPasswordRequest): Observable<AuthMessageResponse> {
    return this.http.post<AuthMessageResponse>(`${this.endpoint}/reset-password`, payload, { withCredentials: true });
  }

  loadSession(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>(`${this.endpoint}/me`, { withCredentials: true }).pipe(
      tap((user) => this.storeUser(user)),
    );
  }

  logout(): void {
    this.clearSession();
    void firstValueFrom(
      this.http.post<AuthMessageResponse>(`${this.endpoint}/logout`, {}, { withCredentials: true }),
    ).catch(() => undefined);
  }

  clearSession(): void {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('accessToken');
  }

  getCurrentUser(): AuthenticatedUser | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthenticatedUser;
    } catch {
      this.clearSession();
      return null;
    }
  }

  isAuthenticated(): Observable<boolean> {
    if (this.getCurrentUser()) {
      return of(true);
    }

    return this.loadSession().pipe(
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      }),
    );
  }

  hasRole(rol: string): Observable<boolean> {
    const user = this.getCurrentUser();

    if (user) {
      return of(user.rol === rol);
    }

    return this.loadSession().pipe(
      map((currentUser) => currentUser.rol === rol),
      catchError(() => {
        this.clearSession();
        return of(false);
      }),
    );
  }

  private storeUser(user: AuthenticatedUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}

