import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { mechanicGuard } from './mechanic.guard';

describe('mechanicGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => mechanicGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
