import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

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
  private readonly endpoint = `${environment.apiUrl}/auth`;
  private readonly accessTokenKey = 'accessToken';
  private readonly userKey = 'user';

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.endpoint}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.accessTokenKey, response.accessToken);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      }),
    );
  }

  register(payload: RegisterRequest): Observable<AuthMessageResponse> {
    return this.http.post<AuthMessageResponse>(`${this.endpoint}/register`, payload);
  }

  forgotPassword(payload: ForgotPasswordRequest): Observable<AuthMessageResponse> {
    return this.http.post<AuthMessageResponse>(`${this.endpoint}/forgot-password`, payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<AuthMessageResponse> {
    return this.http.post<AuthMessageResponse>(`${this.endpoint}/reset-password`, payload);
  }

  logout(): void {
    this.clearSession();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
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

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const user = this.getCurrentUser();

    if (!accessToken || !user) {
      if (accessToken || localStorage.getItem(this.userKey)) {
        this.clearSession();
      }
      return false;
    }

    return true;
  }

  hasRole(rol: string): boolean {
    return this.getCurrentUser()?.rol === rol;
  }

  private clearSession(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.userKey);
  }
}
