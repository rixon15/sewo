import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHotelDetailsComponent } from './dashboard-hotel-details.component';

describe('DashboardHotelDetailsComponent', () => {
  let component: DashboardHotelDetailsComponent;
  let fixture: ComponentFixture<DashboardHotelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHotelDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardHotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
