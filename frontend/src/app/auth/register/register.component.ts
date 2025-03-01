import { Component } from '@angular/core';
import { AuthPageHeaderComponent } from '../shared-components/auth-page-header/auth-page-header.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    AuthPageHeaderComponent,
    FormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}
