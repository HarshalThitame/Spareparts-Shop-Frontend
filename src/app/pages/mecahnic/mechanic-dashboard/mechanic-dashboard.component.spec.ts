import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicDashboardComponent } from './mechanic-dashboard.component';

describe('MechanicDashboardComponent', () => {
  let component: MechanicDashboardComponent;
  let fixture: ComponentFixture<MechanicDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
