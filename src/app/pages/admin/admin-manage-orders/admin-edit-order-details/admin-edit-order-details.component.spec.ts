import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditOrderDetailsComponent } from './admin-edit-order-details.component';

describe('AdminEditOrderDetailsComponent', () => {
  let component: AdminEditOrderDetailsComponent;
  let fixture: ComponentFixture<AdminEditOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditOrderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
