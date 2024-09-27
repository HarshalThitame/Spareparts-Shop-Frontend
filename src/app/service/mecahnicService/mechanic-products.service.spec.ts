import { TestBed } from '@angular/core/testing';

import { MechanicProductsService } from './mechanic-products.service';

describe('MechanicProductsService', () => {
  let service: MechanicProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MechanicProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
