import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMyProfileComponent } from './dashboard-my-profile.component';

describe('DashboardMyProfileComponent', () => {
  let component: DashboardMyProfileComponent;
  let fixture: ComponentFixture<DashboardMyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMyProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
