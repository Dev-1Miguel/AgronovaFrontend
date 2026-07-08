import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';

import { AuthService } from '../service/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated']);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('allows navigation when user is authenticated', async () => {
    authService.isAuthenticated.and.returnValue(of(true));

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(await firstValueFrom(result as ReturnType<AuthService['isAuthenticated']>)).toBeTrue();
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to login when user is not authenticated', async () => {
    const loginTree = {} as ReturnType<Router['createUrlTree']>;
    authService.isAuthenticated.and.returnValue(of(false));
    router.createUrlTree.and.returnValue(loginTree);

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(await firstValueFrom(result as ReturnType<AuthService['isAuthenticated']>)).toBe(loginTree as never);
    expect(router.createUrlTree).toHaveBeenCalledOnceWith(['/login']);
  });
});
