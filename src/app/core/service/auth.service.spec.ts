import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('authenticates when token and user are valid', () => {
    storeSession(createToken(Math.floor(Date.now() / 1000) + 60), user);

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('clears session when token is expired', () => {
    storeSession(createToken(Math.floor(Date.now() / 1000) - 60), user);

    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('clears session when token is missing', () => {
    localStorage.setItem('user', JSON.stringify(user));

    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('clears session when user is not valid JSON', () => {
    localStorage.setItem('accessToken', createToken(Math.floor(Date.now() / 1000) + 60));
    localStorage.setItem('user', '{bad-json');

    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  function storeSession(token: string, currentUser: AuthenticatedUser): void {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(currentUser));
  }

  function createToken(exp: number): string {
    return `${encodeBase64Url({ alg: 'none' })}.${encodeBase64Url({ exp })}.signature`;
  }

  function encodeBase64Url(value: object): string {
    return btoa(JSON.stringify(value))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
});
