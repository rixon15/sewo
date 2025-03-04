import { Component } from '@angular/core';
import { DashboardMenuComponent } from '../../shared-components/dashboard-menu/dashboard-menu.component';

@Component({
  selector: 'app-dashboard-main-page',
  imports: [
    DashboardMenuComponent,
  ],
  templateUrl: './dashboard-main-page.component.html',
  styleUrl: './dashboard-main-page.component.css'
})
export class DashboardMainPageComponent {

}
