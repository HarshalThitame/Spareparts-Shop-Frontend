import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCancelledOrdersComponent } from './admin-cancelled-orders.component';

describe('AdminCancelledOrdersComponent', () => {
  let component: AdminCancelledOrdersComponent;
  let fixture: ComponentFixture<AdminCancelledOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCancelledOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCancelledOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
