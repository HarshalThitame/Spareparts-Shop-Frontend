import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFinancialMetricsComponent } from './admin-financial-metrics.component';

describe('AdminFinancialMetricsComponent', () => {
  let component: AdminFinancialMetricsComponent;
  let fixture: ComponentFixture<AdminFinancialMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFinancialMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFinancialMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
