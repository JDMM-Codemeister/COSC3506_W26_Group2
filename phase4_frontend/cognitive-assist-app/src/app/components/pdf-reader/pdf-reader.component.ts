import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
    selector: 'app-pdf-reader',
    templateUrl: './pdf-reader.component.html',
    styleUrls: ['./pdf-reader.component.css']
})
export class PdfReaderComponent implements OnInit {
    fileId: number | null = null;
    pdfContent: any = null;
    currentLineIndex = 0;
    loading = true;
    focusedMode = true;

    constructor(
        private dashboardService: DashboardService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        // Get file ID from route params
        this.route.params.subscribe(params => {
            this.fileId = params['id'];
            if (this.fileId) {
                this.loadPDFContent();
            }
        });
    }


    // Load PDF content from backend API
    loadPDFContent() {
        this.loading = true;
        this.dashboardService.getPDFContent(this.fileId!).subscribe({
            next: (data) => {
                this.pdfContent = data;
                if (!this.pdfContent.lines || this.pdfContent.lines.length === 0) {
                    console.warn('PDF content is empty, using sample data');
                    this.pdfContent.lines = [
                        "PDF content could not be loaded.",
                    ];
                }
                this.currentLineIndex = 0;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.pdfContent = {
                    lines: [
                        "Failed to load PDF content.",
                        "Backend PDF parsing service may not be available.",
                        "Please try uploading the PDF again."
                    ]
                };
                console.error('PDF load error:', error);
            }
        });
    }

    nextLine() {
        if (this.pdfContent && this.currentLineIndex < this.pdfContent.lines.length - 1) {
            this.currentLineIndex++;
        }
    }

    previousLine() {
        if (this.currentLineIndex > 0) {
            this.currentLineIndex--;
        }
    }

    toggleFocusedMode() {
        this.focusedMode = !this.focusedMode;
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    getCurrentLine(): string {
        return this.pdfContent?.lines[this.currentLineIndex] || '';
    }

    getPreviousLine(): string {
        if (this.currentLineIndex > 0) {
            return this.pdfContent?.lines[this.currentLineIndex - 1] || '';
        }
        return '';
    }

    getNextLine(): string {
        if (this.pdfContent && this.currentLineIndex < this.pdfContent.lines.length - 1) {
            return this.pdfContent?.lines[this.currentLineIndex + 1] || '';
        }
        return '';
    }

    getProgress(): number {
        if (!this.pdfContent) return 0;
        return Math.round((this.currentLineIndex / this.pdfContent.lines.length) * 100);
    }

    isLastLine(): boolean {
        if (!this.pdfContent) return false;
        return this.currentLineIndex === this.pdfContent.lines.length - 1;
    }

    isFirstLine(): boolean {
        return this.currentLineIndex === 0;
    }
}
