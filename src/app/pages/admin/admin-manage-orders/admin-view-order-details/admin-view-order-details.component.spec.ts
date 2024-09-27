import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewOrderDetailsComponent } from './admin-view-order-details.component';

describe('AdminViewOrderDetailsComponent', () => {
  let component: AdminViewOrderDetailsComponent;
  let fixture: ComponentFixture<AdminViewOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminViewOrderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
