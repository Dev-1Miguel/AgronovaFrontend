import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const request = isApiRequest ? req.clone({ withCredentials: true }) : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || !isApiRequest) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        authService.clearSession();
        void router.navigate(['/login']);
      } else if (error.status === 403) {
        void router.navigate(['/dashboard']);
      }

      return throwError(() => error);
    }),
  );
};
