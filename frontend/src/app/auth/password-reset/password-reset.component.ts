import { NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { AuthPageHeaderComponent } from '../shared-components/auth-page-header/auth-page-header.component';

@Component({
  selector: 'app-password-reset',
  imports: [
    FormsModule,
    NgIf,
    AuthPageHeaderComponent
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {


  token: string | null = null;
  email: string | null = null;
  expiresAt: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private auth: AuthService) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      this.expiresAt = params['expires'];
    });
  };




  showPassword1 = false;
  showPassword2 = false;
  password: string | null = null;
  @ViewChild('myForm') myForm!: NgForm;
  toaster = inject(ToastrService)

  togglePasswordVisibility1(): void {
    this.showPassword1 = !this.showPassword1;

    const input = document.querySelector('#password') as HTMLInputElement;
    input.type = this.showPassword1 ? 'text' : 'password';
  }
  togglePasswordVisibility2(): void {
    this.showPassword2 = !this.showPassword2;

    const input = document.querySelector('#confirmPassword') as HTMLInputElement;
    input.type = this.showPassword2 ? 'text' : 'password';
  }

  handleSubmit(form: NgForm) {
    // Implement password reset logic here
    if (form.value.password === '' || form.value.confirmPassword === '') {
      this.toaster.error('Please fill in all fields');
      return;
    } else if (form.value.password !== form.value.confirmPassword) {
      this.toaster.error('Passwords do not match');
      return;
    }

    console.log(this.expiresAt)

    this.auth.resetPassword(this.token!, form.value.password, this.email!, this.expiresAt!).subscribe({
      next: () => {
        this.toaster.success('Password reset successful');


        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1000)
      },
      error: (error: any) => {
        this.toaster.error(error.message);
      }
    });
  }
}
