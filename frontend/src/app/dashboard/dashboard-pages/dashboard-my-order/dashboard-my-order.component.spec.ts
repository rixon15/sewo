import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMyOrderComponent } from './dashboard-my-order.component';

describe('DashboardMyOrderComponent', () => {
  let component: DashboardMyOrderComponent;
  let fixture: ComponentFixture<DashboardMyOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMyOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
