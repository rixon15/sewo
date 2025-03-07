import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private userDataSubject = new BehaviorSubject<any>(null);
  userData$: Observable<any> = this.userDataSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    this.checkAuth();
    console.log(this.userData$);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.isLoggedInSubject.next(true);
        this.userDataSubject.next(response.user);
      })
    );
  }

  register(user: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, user);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/verify`, { token });
  }

  sendPasswordResetLink(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/password/reset/email`, email);
  }

  resetPassword(
    token: string,
    password: string,
    email: string,
    expires: string
  ): Observable<any> {
    console.log({ token, password, email, expires });

    return this.http.post(`${environment.apiUrl}/password/reset`, {
      token,
      password,
      email,
      expires,
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.userDataSubject.next(null);
    this.router.navigate(['/auth/login']); // redirect to login page
  }

  checkAuth(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {
      return this.http
        .get(`${environment.apiUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          tap((response) => {
            this.isLoggedInSubject.next(true); // set auth status to true
            this.userDataSubject.next(response); // store user data
            console.log('Authentication successful:', response);
          }),
          map(() => true), // auth successful
          catchError((error) => {
            this.isLoggedInSubject.next(false);
            this.userDataSubject.next(null);
            console.error('Authentication failed:', error);
            return of(false);
          })
        );
    } else {
      this.isLoggedInSubject.next(false);
      this.userDataSubject.next(null);
      return of(false);
    }
  }
}
