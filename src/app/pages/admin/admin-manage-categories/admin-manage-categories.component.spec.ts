import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageCategoriesComponent } from './admin-manage-categories.component';

describe('AdminManageCategoriesComponent', () => {
  let component: AdminManageCategoriesComponent;
  let fixture: ComponentFixture<AdminManageCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminManageCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManageCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
