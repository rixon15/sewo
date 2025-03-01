import { Component, inject, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RememberEmailService } from '../services/rememberEmail.service';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { AuthPageHeaderComponent } from '../shared-components/auth-page-header/auth-page-header.component';

@Component({
  selector: 'app-login',
  imports: [
    NgIf,
    FormsModule,
    AuthPageHeaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {


  constructor(private router: Router, private rememberEmailService: RememberEmailService, private authService: AuthService) { }

  showPassword = false;
  @ViewChild('myForm') myForm!: NgForm;
  toaster = inject(ToastrService);
  rememberEmail = false;
  emailFieldValue = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;

    const input = document.querySelector('#password') as HTMLInputElement;
    input.type = this.showPassword ? 'text' : 'password';
  }

  checkForRememberedEmail() {
    const rememberedEmail = this.rememberEmailService.getRememberedEmail();
    if (rememberedEmail) {
      this.emailFieldValue = rememberedEmail;
      this.rememberEmail = true;
    }
  }

  async handleSubmit(form: NgForm) {

    try {

      const response = await firstValueFrom(this.authService.login(form.value));
      localStorage.setItem('token', response.token);

      this.authService.checkAuth(); //to update authentication status

      this.toaster.success('Login successful!', 'test', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-center',
      });

      if (this.rememberEmail) {
        this.rememberEmailService.setRememberedEmail(form.value.email);
      } else {
        this.rememberEmailService.clearRememberedEmail();
      }

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 500);

    } catch (e: any) {
      console.log(e);
      this.toaster.error(e.data.message, '', {
        timeOut: 1000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-center',
      });
    }

  }


  ngOnInit() {
    this.checkForRememberedEmail();
  }
}
