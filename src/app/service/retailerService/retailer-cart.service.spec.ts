import { TestBed } from '@angular/core/testing';

import { RetailerCartService } from './retailer-cart.service';

describe('RetailerCartService', () => {
  let service: RetailerCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailerCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
