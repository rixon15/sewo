import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {


  token: string | null = null;
  toaster = inject(ToastrService)

  constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private router: Router) { }

  verifyEmail(token: string): void {

    try {
      this.authService.verifyEmail(token).subscribe({
        next: () => {
          this.toaster.success('Email verified successfully!');

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (error: any) => {
          console.error('Email verification failed:', error);
          this.toaster.error(error, 'Email verification failed:')
        }
      });
    } catch (error: any) {
      console.error('Error verifying email:', error);
      this.toaster.error(error.message, 'Error verifying email:')
    }
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      this.token = params.get('token');
      if (this.token) {
        this.verifyEmail(this.token);
      } else {
        console.log('Token no found!')
      }
    })
  }
}
