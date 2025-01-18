import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUnpaidOrdersComponent } from './admin-unpaid-orders.component';

describe('AdminUnpaidOrdersComponent', () => {
  let component: AdminUnpaidOrdersComponent;
  let fixture: ComponentFixture<AdminUnpaidOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUnpaidOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUnpaidOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
