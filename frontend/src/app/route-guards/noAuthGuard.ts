import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../auth/services/auth.service";
import { retry } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.authService.isLoggedIn$) {
      this.router.navigate(['/']) //Redirect if logged in
      return false;
    } else {
      return true
    }
  }
}
