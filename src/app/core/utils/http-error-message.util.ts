import { HttpErrorResponse } from '@angular/common/http';

export function getHttpErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const backendMessage = error.error?.message;

  if (typeof backendMessage === 'string' && backendMessage.trim()) {
    return backendMessage.trim();
  }

  if (Array.isArray(backendMessage)) {
    const message = backendMessage
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .join(', ');

    if (message) {
      return message;
    }
  }

  return fallback;
}
