import { Component } from '@angular/core';
import { DashboardMenuComponent } from '../../shared-components/dashboard-menu/dashboard-menu.component';
import { DashboardHeaderComponent } from '../../shared-components/dashboard-header/dashboard-header.component';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    DashboardMenuComponent,
    DashboardHeaderComponent
    ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {

}
