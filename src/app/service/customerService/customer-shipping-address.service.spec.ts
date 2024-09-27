import { TestBed } from '@angular/core/testing';

import { CustomerShippingAddressService } from './customer-shipping-address.service';

describe('CustomerShippingAddressService', () => {
  let service: CustomerShippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerShippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
