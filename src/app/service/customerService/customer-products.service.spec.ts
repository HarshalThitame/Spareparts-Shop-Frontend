import { TestBed } from '@angular/core/testing';

import { CustomerProductsService } from './customer-products.service';

describe('CustomerProductsService', () => {
  let service: CustomerProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
