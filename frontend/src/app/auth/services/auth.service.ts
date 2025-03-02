import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "../../../environments/environments";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private userDataSubject = new BehaviorSubject<any>(null);
  userData$: Observable<any> = this.userDataSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    this.checkAuth();
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, credentials);
  }

  register(user: { name: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']); // redirect to login page
  }

  checkAuth(): void {

    const token = localStorage.getItem('token');
    if (token) {
      this.http.get(`${environment.apiUrl}/profile`, { // Make a request to the protected /profile endpoint
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .pipe(
          tap((response) => {
            this.userDataSubject.next(response); //store user data
            console.log('Authentication successful:', response);
          }),
          map(() => true), //auth successful
          catchError((error) => {
            this.userDataSubject.next(null);
            console.error('Authentication failed:', error);
            return of(false);
          }
          )
        ).subscribe((isAuthenticated) => {
          this.isLoggedInSubject.next(isAuthenticated)
        })
    } else {
      this.isLoggedInSubject.next(false);
      this.userDataSubject.next(null)
    }
  }


}
