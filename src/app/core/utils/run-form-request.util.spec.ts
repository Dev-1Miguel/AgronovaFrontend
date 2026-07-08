import { of, throwError } from 'rxjs';

import { runFormRequest } from './run-form-request.util';

describe('runFormRequest', () => {
  it('ejecuta success, limpia error y apaga loading al finalizar', () => {
    const loadingStates: boolean[] = [];
    const errors: string[] = [];
    let successValue = '';

    runFormRequest({
      request$: of('ok'),
      setLoading: (loading) => loadingStates.push(loading),
      setErrorMessage: (message) => errors.push(message),
      fallbackMessage: 'fallback',
      logMessage: 'noop',
      onSuccess: (value) => {
        successValue = value;
      },
    });

    expect(successValue).toBe('ok');
    expect(loadingStates).toEqual([true, false]);
    expect(errors).toEqual(['']);
  });

  it('usa el fallback y apaga loading ante error', () => {
    const loadingStates: boolean[] = [];
    let errorMessage = '';

    runFormRequest({
      request$: throwError(() => new Error('boom')),
      setLoading: (loading) => loadingStates.push(loading),
      setErrorMessage: (message) => {
        errorMessage = message;
      },
      fallbackMessage: 'fallback',
      logMessage: 'noop',
      onSuccess: () => undefined,
    });

    expect(errorMessage).toBe('fallback');
    expect(loadingStates).toEqual([true, false]);
  });
});
