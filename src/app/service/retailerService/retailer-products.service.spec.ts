import { TestBed } from '@angular/core/testing';

import { RetailerProductsService } from './retailer-products.service';

describe('RetailerProductsService', () => {
  let service: RetailerProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailerProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
