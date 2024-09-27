import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { retailerGuard } from './retailer.guard';

describe('retailerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => retailerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
