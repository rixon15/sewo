import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css',
})
export class DashboardHeaderComponent {

  constructor(private router: Router) {}

  handleSearch(): void {

    const input = document.getElementById('searchBar') as HTMLInputElement;

    console.log(input)
    
    const text = input.value;


    if(text.length < 1) {
      return;
    } else {
      this.router.navigate([`/search?q=${text}`]);  
    }

  }
}
