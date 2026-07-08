import { routes } from './app.routes';

describe('routes', () => {
  it('redirects unknown routes to login', () => {
    const fallback = routes[routes.length - 1];

    expect(fallback).toEqual(jasmine.objectContaining({
      path: '**',
      redirectTo: 'login',
    }));
  });
});

