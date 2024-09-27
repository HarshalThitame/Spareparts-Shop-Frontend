import { TestBed } from '@angular/core/testing';

import { MechanicCartService } from './mechanic-cart.service';

describe('MechanicCartService', () => {
  let service: MechanicCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MechanicCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
