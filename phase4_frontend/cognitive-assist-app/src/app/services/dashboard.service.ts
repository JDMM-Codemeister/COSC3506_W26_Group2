import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    private mockDashboardUrl = '/assets/mock/dashboard.json';
    private mockReminderUrl = '/assets/mock/reminder.json';
    private mockPdfContentUrl = '/assets/mock/pdf-content.json';

    constructor(private http: HttpClient) { }
    // Get dashboard data with user's files and reminders
    getDashboardData(): Observable<any> {
        return this.http.get<any>(this.mockDashboardUrl);
    }

    addReminder(reminder: any): Observable<any> {
        return this.http.get<any>(this.mockReminderUrl);
    }

    // Delete reminder by ID
    deleteReminder(reminderId: number): Observable<any> {
        return this.http.delete<any>(`/assets/mock/reminder.json`);
    }

    // Upload a PDF file to backend and return normalized file metadata.
    uploadPDF(file: File, userId: number): Observable<{ message: string; file: DashboardFile }> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', String(userId));

        return this.http.post<any>(`${this.apiBaseUrl}/upload`, formData).pipe(
            map((response: any) => ({
                ...response,
                file: this.mapBackendFile(response.file)
            }))
        );
    }

    // Fetch files from backend and map fields to frontend model.
    getFiles(userId: number): Observable<DashboardFile[]> {
        return this.http.get<any[]>(`${this.apiBaseUrl}/files/${userId}`).pipe(
            map((files: any[]) => files.map((file: any) => this.mapBackendFile(file)))
        );
    }

    //Returning mock pdf for now
    //Need to implement actual pdf parsing and content extraction 
    getPDFContent(fileId: number): Observable<any> {
        return this.http.get<any>(this.mockPdfContentUrl);
    }

    private mapBackendFile(file: any): DashboardFile {
        return {
            id: file?.id ?? file?.materialId ?? 0,
            title: file?.title ?? file?.fileName ?? 'Untitled',
            filePath: file?.filePath ?? '',
            fileUrl: file?.fileUrl ?? '',
            uploadedAt: file?.uploadedAt ?? file?.uploadDate ?? ''
        };
    }
}
