import { TestBed } from '@angular/core/testing';

import { BrandAndCategoryDiscountService } from './brand-and-category-discount.service';

describe('BrandAndCategoryDiscountService', () => {
  let service: BrandAndCategoryDiscountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandAndCategoryDiscountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
