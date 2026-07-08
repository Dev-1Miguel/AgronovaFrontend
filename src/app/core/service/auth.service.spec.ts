import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthenticatedUser } from '../models/auth.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const user: AuthenticatedUser = {
    id: 'user-1',
    nombre: 'Admin',
    correo: 'admin@agronova.local',
    rol: 'Administrador',
    estado: 'Activo',
  };

  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    localStorage.clear();
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('stores the user returned by login without requiring a local access token', async () => {
    const resultPromise = firstValueFrom(service.login({ correo: user.correo, contrasena: 'secreta123' }));
    const request = httpMock.expectOne(`${environment.apiUrl}/auth/login`);

    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();

    request.flush({ user });
    await resultPromise;

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(service.getCurrentUser()).toEqual(user);
  });

  it('loads the current session from the backend when no user is cached', async () => {
    const resultPromise = firstValueFrom(service.isAuthenticated());
    const request = httpMock.expectOne(`${environment.apiUrl}/auth/me`);

    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBeTrue();

    request.flush(user);

    expect(await resultPromise).toBeTrue();
    expect(service.getCurrentUser()).toEqual(user);
  });

  it('clears the cached user when the session endpoint rejects', async () => {
    localStorage.setItem('user', '{bad-json');

    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('clears local session and calls logout endpoint', () => {
    localStorage.setItem('user', JSON.stringify(user));

    service.logout();

    const request = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBeTrue();
    request.flush({ message: 'Sesion cerrada correctamente.' });
    expect(service.getCurrentUser()).toBeNull();
  });
});
