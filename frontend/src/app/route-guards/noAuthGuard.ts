import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../auth/services/auth.service";
import { Observable } from "rxjs";
import {map, take} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.checkAuth().pipe(
      take(1),
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }
    ));
    
  }

}
