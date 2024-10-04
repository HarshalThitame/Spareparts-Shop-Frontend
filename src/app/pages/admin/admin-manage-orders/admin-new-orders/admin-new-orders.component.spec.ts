import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewOrdersComponent } from './admin-new-orders.component';

describe('AdminNewOrdersComponent', () => {
  let component: AdminNewOrdersComponent;
  let fixture: ComponentFixture<AdminNewOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminNewOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
