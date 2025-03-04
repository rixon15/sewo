import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<boolean> {
  constructor(private authService: AuthService, private router: Router) {}

  resolve(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.authService.checkAuth();
        }
      })
    );
  }
}
