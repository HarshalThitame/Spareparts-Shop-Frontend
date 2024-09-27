import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerNavbarComponent } from './retailer-navbar.component';

describe('RetailerNavbarComponent', () => {
  let component: RetailerNavbarComponent;
  let fixture: ComponentFixture<RetailerNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetailerNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailerNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
