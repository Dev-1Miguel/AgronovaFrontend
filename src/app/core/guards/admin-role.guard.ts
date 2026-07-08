import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../service/auth.service';

export const adminRoleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.hasRole('Administrador').pipe(
    map((isAdmin) => isAdmin ? true : router.createUrlTree(['/dashboard'])),
  );
};
