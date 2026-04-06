import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    firstName = '';
    lastName = '';
    email = '';
    password = '';
    confirmPassword = '';
    loading = false;
    error = '';
    success = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }


    onRegister() {
        this.error = '';
        this.success = false;

        //Generic Validation
        if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
            this.error = 'All fields are required';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.error = 'Passwords do not match';
            return;
        }

        if (this.password.length < 5) {
            this.error = 'Password must be at least 5 characters';
            return;
        }

        this.loading = true;

        this.authService.register({
            fullName: `${this.firstName} ${this.lastName}`,
            email: this.email,
            password: this.password
        }).subscribe({
            next: (response) => {
                this.loading = false;
                this.success = true;
                console.log('Registration successful', response);
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2000);
            },
            error: (error) => {
                this.loading = false;
                if (error.error && error.error.message) {
                    this.error = error.error.message;
                } else if (error.message) {
                    this.error = error.message;
                } else {
                    this.error = 'Registration failed. Please try again.';
                }
                console.error('Registration error:', error);
            }
        });
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
