import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import {
  Category,
  Explore,
  Logout,
  Messages,
  MyOrder,
  MyProfile,
} from '../../../../../public/assets/menu-items/SVGValues';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-menu.component.html',
  styleUrl: './dashboard-menu.component.css',
})
export class DashboardMenuComponent implements OnInit, OnDestroy {
  activeRoute: string = '';
  routerSubscription: Subscription | undefined;
  DashboardSvgIcon: SafeHtml;
  ExploreSvgIcon: SafeHtml;
  MyOrderSvgIcon: SafeHtml;
  MessagesSvgIcon: SafeHtml;
  MyProfileSvgIcon: SafeHtml;
  LogoutSvgIcon: SafeHtml;

  constructor(
    private router: Router,
    private auth: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.DashboardSvgIcon = this.sanitizer.bypassSecurityTrustHtml(Category);
    this.ExploreSvgIcon = this.sanitizer.bypassSecurityTrustHtml(Explore);
    this.MyOrderSvgIcon = this.sanitizer.bypassSecurityTrustHtml(MyOrder);
    this.MessagesSvgIcon = this.sanitizer.bypassSecurityTrustHtml(Messages);
    this.MyProfileSvgIcon = this.sanitizer.bypassSecurityTrustHtml(MyProfile);
    this.LogoutSvgIcon = this.sanitizer.bypassSecurityTrustHtml(Logout);
  }

  ngOnInit(): void {
    this.updateActiveRoute();
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveRoute();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateActiveRoute(): void {
    this.activeRoute = this.router.url;
  }

  isRouteActive(route: string): boolean {
    return this.activeRoute === route;
  }

  logout(): void {
    this.auth.logout();
  }
}
