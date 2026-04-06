import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface DashboardFile {
    id: number;
    title: string;
    filePath: string;
    fileUrl: string;
    uploadedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiBaseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) {
    }

    // Get dashboard data
    getDashboardData(userId: number): Observable<any> {
        return of({
            userName: 'User',
            reminders: []
        });
    }

    // Get files for a user
    getFiles(userId: number): Observable<DashboardFile[]> {
        return this.http.get<DashboardFile[]>(`${this.apiBaseUrl}/files/${userId}`).pipe(
            catchError(error => {
                console.error('Error getting files:', error);
                return of([]);
            })
        );
    }

    // Add reminder
    addReminder(userId: number, reminder: any): Observable<any> {
        return of({
            reminder: {
                id: Math.floor(Math.random() * 1000),
                ...reminder
            }
        });
    }

    // Delete reminder
    deleteReminder(reminderId: number): Observable<any> {
        return of({ success: true });
    }

    // Upload PDF
    uploadPDF(file: File, userId: number): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', userId.toString());

        return this.http.post(`${this.apiBaseUrl}/upload`, formData).pipe(
            map(response => response),
            catchError(error => {
                console.error('Upload error:', error);
                throw error;
            })
        );
    }

    // Get PDF content from backend
    getPDFContent(fileId: number): Observable<any> {
        return this.http.get(`${this.apiBaseUrl}/pdf-content/${fileId}`).pipe(
            catchError(error => {
                console.error('Error getting PDF content:', error);
                return of({
                    success: false,
                    fileId: fileId,
                    title: 'Error',
                    lines: ['Failed to load PDF content']
                });
            })
        );
    }
}
