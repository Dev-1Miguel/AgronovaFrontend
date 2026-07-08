import { Observable, finalize } from 'rxjs';

import { getHttpErrorMessage } from './http-error-message.util';

export interface RunFormRequestOptions<T> {
  request$: Observable<T>;
  setLoading: (loading: boolean) => void;
  setErrorMessage: (message: string) => void;
  fallbackMessage: string;
  logMessage: string;
  onSuccess: (value: T) => void;
}

export function runFormRequest<T>(options: RunFormRequestOptions<T>): void {
  options.setLoading(true);
  options.setErrorMessage('');

  options.request$
    .pipe(finalize(() => options.setLoading(false)))
    .subscribe({
      next: (value) => options.onSuccess(value),
      error: (error) => {
        options.setErrorMessage(getHttpErrorMessage(error, options.fallbackMessage));
        console.error(options.logMessage, error);
      },
    });
}
