import { TestBed } from '@angular/core/testing';

import { MechanicShippingAddressService } from './mechanic-shipping-address.service';

describe('MechanicShippingAddressService', () => {
  let service: MechanicShippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MechanicShippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
