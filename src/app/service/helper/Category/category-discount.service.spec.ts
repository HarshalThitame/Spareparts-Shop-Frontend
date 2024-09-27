import { TestBed } from '@angular/core/testing';

import { CategoryDiscountService } from './category-discount.service';

describe('CategoryDiscountService', () => {
  let service: CategoryDiscountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryDiscountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
