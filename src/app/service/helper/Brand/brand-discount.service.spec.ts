import { TestBed } from '@angular/core/testing';

import { BrandDiscountService } from './brand-discount.service';

describe('BrandDiscountService', () => {
  let service: BrandDiscountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandDiscountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
