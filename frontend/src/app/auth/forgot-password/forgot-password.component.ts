import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(private authService: AuthService, private router: Router) { }

  toaster = inject(ToastrService);

  handleSubmit(form: NgForm) {

    console.log(form.value)

    this.authService.sendPasswordResetLink(form.value).subscribe({
      next: () => {
        this.toaster.success('Please check your email for further instructions');

        setTimeout(() => {
          this.router.navigate(['/'])
        }, 1000)
      },
      error: (error: any) => {
        console.error('Failed to send the reset link', error.message);
        this.toaster.error(error.message, 'Password reset failed');
      }
    })

  }
}
