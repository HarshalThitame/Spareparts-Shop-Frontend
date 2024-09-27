import { TestBed } from '@angular/core/testing';

import { BrandAndModelDiscountService } from './brand-and-model-discount.service';

describe('BrandAndModelDiscountService', () => {
  let service: BrandAndModelDiscountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandAndModelDiscountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
