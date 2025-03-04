import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { NoAuthGuard } from './route-guards/noAuthGuard';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { DashboardMainPageComponent } from './dashboard/dashboard-pages/dashboard-main-page/dashboard-main-page.component';
import { DashboardExploreComponent } from './dashboard/dashboard-pages/dashboard-explore/dashboard-explore.component';
import { DashboardMyOrderComponent } from './dashboard/dashboard-pages/dashboard-my-order/dashboard-my-order.component';
import { DashboardMessagesComponent } from './dashboard/dashboard-pages/dashboard-messages/dashboard-messages.component';
import { DashboardMyProfileComponent } from './dashboard/dashboard-pages/dashboard-my-profile/dashboard-my-profile.component';
import { AuthGuard } from './route-guards/AuthGuard';
import { AuthResolver } from './auth/auth-resolver/auth-resolver';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, canActivate: [NoAuthGuard],},
  { path: 'auth/register', component: RegisterComponent, canActivate: [NoAuthGuard],},
  { path: 'auth/forgot-password', component: ForgotPasswordComponent, canActivate: [NoAuthGuard],},
  { path: 'auth/verify-email', component: VerifyEmailComponent, canActivate: [NoAuthGuard],},
  { path: 'auth/password/reset', component: PasswordResetComponent, canActivate: [NoAuthGuard],},
  { path: '', component: DashboardMainPageComponent, canActivate: [AuthGuard], resolve: { auth: AuthResolver } },
  { path: 'explore', component: DashboardExploreComponent, canActivate: [AuthGuard], resolve: { auth: AuthResolver } },
  { path: 'orders', component: DashboardMyOrderComponent, canActivate: [AuthGuard], resolve: { auth: AuthResolver } },
  { path: 'messages', component: DashboardMessagesComponent, canActivate: [AuthGuard], resolve: { auth: AuthResolver } },
  { path: 'profile', component: DashboardMyProfileComponent, canActivate: [AuthGuard], resolve: { auth: AuthResolver } },
];
