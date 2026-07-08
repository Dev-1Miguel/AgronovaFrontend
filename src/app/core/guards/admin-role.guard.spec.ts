import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';

import { AuthService } from '../service/auth.service';
import { adminRoleGuard } from './admin-role.guard';

describe('adminRoleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['hasRole']);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('allows navigation for administrators', async () => {
    authService.hasRole.and.returnValue(of(true));

    const result = TestBed.runInInjectionContext(() => adminRoleGuard({} as never, {} as never));

    expect(await firstValueFrom(result as ReturnType<AuthService['hasRole']>)).toBeTrue();
    expect(authService.hasRole).toHaveBeenCalledOnceWith('Administrador');
  });

  it('redirects non administrators to dashboard', async () => {
    const dashboardTree = {} as ReturnType<Router['createUrlTree']>;
    authService.hasRole.and.returnValue(of(false));
    router.createUrlTree.and.returnValue(dashboardTree);

    const result = TestBed.runInInjectionContext(() => adminRoleGuard({} as never, {} as never));

    expect(await firstValueFrom(result as ReturnType<AuthService['hasRole']>)).toBe(dashboardTree as never);
    expect(router.createUrlTree).toHaveBeenCalledOnceWith(['/dashboard']);
  });
});
