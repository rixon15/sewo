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
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout/dashboard-layout.component';
import { DashboardHotelDetailsComponent } from './dashboard/dashboard-pages/dashboard-hotel-details/dashboard-hotel-details.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, canActivate: [NoAuthGuard] },
  {
    path: 'auth/register',
    component: RegisterComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'auth/verify-email',
    component: VerifyEmailComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'auth/password/reset',
    component: PasswordResetComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', 
        component: DashboardMainPageComponent, 
        pathMatch: 'full',
      },
      {
        path: 'explore',
        component: DashboardExploreComponent,
      },
      {
        path: 'orders',
        component: DashboardMyOrderComponent,
      },
      {
        path: 'messages',
        component: DashboardMessagesComponent,
      },
      {
        path: 'profile',
        component: DashboardMyProfileComponent,
      },
      {
        path: 'hotel/:id',
        component: DashboardHotelDetailsComponent,
      },
    ],
    canActivate: [AuthGuard],
    resolve: { auth: AuthResolver },
  },
];
