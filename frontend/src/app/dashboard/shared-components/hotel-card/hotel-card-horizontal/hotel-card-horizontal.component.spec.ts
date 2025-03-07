import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCardHorizontalComponent } from './hotel-card-horizontal.component';

describe('HotelCardHorizontalComponent', () => {
  let component: HotelCardHorizontalComponent;
  let fixture: ComponentFixture<HotelCardHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelCardHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelCardHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
