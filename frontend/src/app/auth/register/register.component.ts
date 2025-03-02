import { Component, inject, ViewChild } from '@angular/core';
import { AuthPageHeaderComponent } from '../shared-components/auth-page-header/auth-page-header.component';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) { }

  terms = false;
  showPassword = false;
  @ViewChild('myForm') myForm!: NgForm;
  toaster = inject(ToastrService);

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;

    const input = document.querySelector('#password') as HTMLInputElement;
    input.type = this.showPassword ? 'text' : 'password';
  }

  handleSubmit(form: NgForm): void {

    if (!this.terms) {
      this.toaster.error('Please accept the terms and conditions', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-center',
      });
      return;
    }

    this.authService.register(form.value).subscribe(() => {
      this.toaster.success('Registration successful. Please check your email for the verification link.', '', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-center',
      });
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    },
      (error: any) => {
        this.toaster.error('Registration failed', error.message, {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-center',
        });
      })

  }


}
