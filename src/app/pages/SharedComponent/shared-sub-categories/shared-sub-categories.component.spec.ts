import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSubCategoriesComponent } from './shared-sub-categories.component';

describe('SharedSubCategoriesComponent', () => {
  let component: SharedSubCategoriesComponent;
  let fixture: ComponentFixture<SharedSubCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedSubCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
