import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../service/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getAccessToken', 'logout']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('adds authorization header only to API requests', () => {
    authService.getAccessToken.and.returnValue('token-123');
    const apiRequest = new HttpRequest('GET', `${environment.apiUrl}/cultivos`);
    let authorizationHeader = '';

    TestBed.runInInjectionContext(() => {
      authInterceptor(apiRequest, (request) => {
        authorizationHeader = request.headers.get('Authorization') ?? '';
        return of(new HttpResponse({ status: 200 }));
      }).subscribe();
    });

    expect(authorizationHeader).toBe('Bearer token-123');

    const externalRequest = new HttpRequest('GET', 'https://example.com/health');
    let hasAuthorizationHeader = true;

    TestBed.runInInjectionContext(() => {
      authInterceptor(externalRequest, (request) => {
        hasAuthorizationHeader = request.headers.has('Authorization');
        return of(new HttpResponse({ status: 200 }));
      }).subscribe();
    });

    expect(hasAuthorizationHeader).toBeFalse();
  });

  it('logs out and navigates to login on API 401', () => {
    authService.getAccessToken.and.returnValue('token-123');
    const request = new HttpRequest('GET', `${environment.apiUrl}/cultivos`);
    const error = new HttpErrorResponse({ status: 401 });
    let thrownError: unknown;

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, () => throwError(() => error)).subscribe({
        error: (currentError) => thrownError = currentError,
      });
    });

    expect(thrownError).toBe(error);
    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledOnceWith(['/login']);
  });

  it('navigates to dashboard on API 403', () => {
    authService.getAccessToken.and.returnValue('token-123');
    const request = new HttpRequest('GET', `${environment.apiUrl}/usuarios`);
    const error = new HttpErrorResponse({ status: 403 });

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, () => throwError(() => error)).subscribe({ error: () => undefined });
    });

    expect(authService.logout).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledOnceWith(['/dashboard']);
  });
});
