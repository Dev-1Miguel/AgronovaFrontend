import { HttpErrorResponse } from '@angular/common/http';

import { getHttpErrorMessage } from './http-error-message.util';

describe('getHttpErrorMessage', () => {
  it('returns backend message when it comes as string', () => {
    const error = new HttpErrorResponse({
      error: { message: 'No se pudo guardar el registro.' },
    });

    expect(getHttpErrorMessage(error, 'Mensaje de respaldo')).toBe('No se pudo guardar el registro.');
  });

  it('joins backend messages when they come as array', () => {
    const error = new HttpErrorResponse({
      error: { message: ['nombre es obligatorio', 'estado invalido'] },
    });

    expect(getHttpErrorMessage(error, 'Mensaje de respaldo')).toBe('nombre es obligatorio, estado invalido');
  });

  it('returns fallback when backend message is missing', () => {
    const error = new HttpErrorResponse({
      error: {},
    });

    expect(getHttpErrorMessage(error, 'Mensaje de respaldo')).toBe('Mensaje de respaldo');
  });
});
