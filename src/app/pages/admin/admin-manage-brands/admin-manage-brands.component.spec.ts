import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageBrandsComponent } from './admin-manage-brands.component';

describe('AdminManageBrandsComponent', () => {
  let component: AdminManageBrandsComponent;
  let fixture: ComponentFixture<AdminManageBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminManageBrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManageBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
