import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSalesOverviewComponent } from './admin-sales-overview.component';

describe('AdminSalesOverviewComponent', () => {
  let component: AdminSalesOverviewComponent;
  let fixture: ComponentFixture<AdminSalesOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSalesOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSalesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
