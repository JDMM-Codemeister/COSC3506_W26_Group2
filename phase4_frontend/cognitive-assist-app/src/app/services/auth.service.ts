import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiBaseUrl = environment.apiBaseUrl;
    private isLoggedInKey = 'is-logged-in';
    private currentUserIdKey = 'current-user-id';
    private currentUserNameKey = 'current-user-name';

    constructor(private http: HttpClient) { }

    login(credentials: any): Observable<any> {
        if (!this.isValidEmail(credentials.email) || !credentials.password) {
            return throwError(() => new Error('Invalid email or password'));
        }

        return this.http.post<any>(`${this.apiBaseUrl}/login`, credentials).pipe(
            tap(response => {
                if (response.message === 'login success') {
                    localStorage.setItem(this.isLoggedInKey, 'true');
                    const userId = response.userId ?? response.user?.userId;
                    const userName = response.user?.fullName;

                    if (userId) {
                        localStorage.setItem(this.currentUserIdKey, String(userId));
                    }

                    if (userName) {
                        localStorage.setItem(this.currentUserNameKey, userName);
                    }
                }
            })
        );
    }

    register(credentials: any): Observable<any> {
        if (!this.isValidEmail(credentials.email) || !credentials.password) {
            return throwError(() => new Error('Invalid email or password'));
        }

        return this.http.post<any>(`${this.apiBaseUrl}/register`, credentials).pipe(
            tap(response => {
                if (response.message === 'registered') {
                    localStorage.setItem(this.isLoggedInKey, 'true');
                    const userId = response.userId ?? response.user?.userId;
                    const userName = response.user?.fullName ?? '';

                    if (userId) {
                        localStorage.setItem(this.currentUserIdKey, String(userId));
                    }

                    if (userName) {
                        localStorage.setItem(this.currentUserNameKey, userName);
                    }
                }
            })
        );
    }

    //Check if user is logged in
    isLoggedIn(): boolean {
        return localStorage.getItem(this.isLoggedInKey) === 'true';
    }

    // Logout user - Terminate user session
    logout(): void {
        localStorage.removeItem(this.isLoggedInKey);
        localStorage.removeItem(this.currentUserIdKey);
        localStorage.removeItem(this.currentUserNameKey);
    }

    // Return the currently logged-in user id from local storage.
    getCurrentUserId(): number | null {
        const userId = localStorage.getItem(this.currentUserIdKey);
        if (!userId) {
            return null;
        }

        const parsed = Number(userId);
        return Number.isNaN(parsed) ? null : parsed;
    }

    // Return the current user display name from local storage.
    getCurrentUserName(): string | null {
        return localStorage.getItem(this.currentUserNameKey);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
