import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVorOrdersComponent } from './admin-vor-orders.component';

describe('AdminVorOrdersComponent', () => {
  let component: AdminVorOrdersComponent;
  let fixture: ComponentFixture<AdminVorOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminVorOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVorOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
