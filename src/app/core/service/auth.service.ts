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
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.userKey);
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
      return null;
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken() && this.getCurrentUser());
  }
}
