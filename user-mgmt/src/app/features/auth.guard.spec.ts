import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: Router;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    const routerSpy = jest.fn().mockImplementation(() => ({
      navigate: jest.fn(),
    }));

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy() }],
    });

    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when user is authenticated', () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('true');

    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { replaceUrl: true });
  });

  it('should redirect to login when authentication flag is false', () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('false');

    const result = executeGuard({} as any, {} as any);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], { replaceUrl: true });
  });

  it('should check localStorage for authentication status', () => {
    const localStorageSpy = jest.spyOn(Storage.prototype, 'getItem');

    executeGuard({} as any, {} as any);

    expect(localStorageSpy).toHaveBeenCalledWith('isAuthenticated');
  });
});
