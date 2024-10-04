import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageCustomersComponent } from './admin-manage-customers.component';

describe('AdminManageCustomersComponent', () => {
  let component: AdminManageCustomersComponent;
  let fixture: ComponentFixture<AdminManageCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminManageCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManageCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
