import {Component, inject, ViewChild} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import API from '../../config/apiClient';
import {LoginResponse} from './types';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  showPassword = false;
  @ViewChild('myForm') myForm!: NgForm;
  toaster = inject(ToastrService);

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;

    const input = document.querySelector('#password') as HTMLInputElement;
    input.type = this.showPassword ? 'text' : 'password';
  }

  async handleSubmit(form: NgForm) {

    try {
      API.post<LoginResponse, LoginResponse>("/login", form.value)
        .then(res => {
          localStorage.setItem('token', res.token)
        })
      .then(() => {
        this.toaster.success('Login successful!','test', {
          timeOut: 1000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-center',
        });
      })

    } catch (e: any) {
      console.log(e);
      this.toaster.error('asd', 'Error!');
    }

  }


}
