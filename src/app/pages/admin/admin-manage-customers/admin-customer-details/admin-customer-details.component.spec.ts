import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerDetailsComponent } from './admin-customer-details.component';

describe('AdminCustomerDetailsComponent', () => {
  let component: AdminCustomerDetailsComponent;
  let fixture: ComponentFixture<AdminCustomerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCustomerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
