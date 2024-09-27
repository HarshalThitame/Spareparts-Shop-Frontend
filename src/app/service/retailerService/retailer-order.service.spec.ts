import { TestBed } from '@angular/core/testing';

import { RetailerOrderService } from './retailer-order.service';

describe('RetailerOrderService', () => {
  let service: RetailerOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailerOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
