import { TestBed } from '@angular/core/testing';

import { MechanicOrderService } from './mechanic-order.service';

describe('MechanicOrderService', () => {
  let service: MechanicOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MechanicOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
