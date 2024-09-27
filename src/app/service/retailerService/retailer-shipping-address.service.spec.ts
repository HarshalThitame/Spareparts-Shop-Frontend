import { TestBed } from '@angular/core/testing';

import { RetailerShippingAddressService } from './retailer-shipping-address.service';

describe('RetailerShippingAddressService', () => {
  let service: RetailerShippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailerShippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
