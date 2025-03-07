import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSearchPageComponent } from './dashboard-search-page.component';

describe('DashboardSearchPageComponent', () => {
  let component: DashboardSearchPageComponent;
  let fixture: ComponentFixture<DashboardSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
