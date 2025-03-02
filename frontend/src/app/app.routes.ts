import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { NoAuthGuard } from './route-guards/noAuthGuard';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'auth/register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/verify-email', component: VerifyEmailComponent }
];
