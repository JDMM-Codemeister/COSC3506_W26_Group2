# PDF Upload Fix Report

## Summary
This document records the code changes applied to fix the PDF upload workflow.
The main goal was to connect frontend upload actions to the real backend API and keep dashboard files synchronized after upload.

## Files Updated

### 1) Frontend API base configuration
- File: `phase4_frontend/cognitive-assist-app/src/environments/environment.ts`
- Change:
	- Added `apiBaseUrl` with value `http://127.0.0.1:5000`.
- Reason:
	- Frontend service now needs a stable backend base URL.

### 2) Dashboard service upload and file list integration
- File: `phase4_frontend/cognitive-assist-app/src/app/services/dashboard.service.ts`
- Changes:
	- Added `DashboardFile` interface for normalized file shape.
	- Added backend base URL usage from environment config.
	- Replaced mock upload request with real `POST /upload` using `FormData`.
	- Added `getFiles(userId)` to call backend `GET /files/{userId}`.
	- Added `mapBackendFile()` to normalize backend fields (`materialId/title/...`) into frontend fields (`id/title/...`).
- Reason:
	- Real upload must send multipart file + `user_id`.
	- Dashboard needs backend file list instead of static mock list.

### 3) Auth service user session persistence for upload
- File: `phase4_frontend/cognitive-assist-app/src/app/services/auth.service.ts`
- Changes:
	- Added localStorage keys for current user id and name.
	- On successful login, stores user id/name from response.
	- On logout, clears stored user id/name.
	- Added `getCurrentUserId()` and `getCurrentUserName()` helper methods.
- Reason:
	- Upload endpoint requires `user_id`.
	- Dashboard should display and use current session identity.

### 4) Dashboard component upload flow and list refresh
- File: `phase4_frontend/cognitive-assist-app/src/app/components/dashboard/dashboard.component.ts`
- Changes:
	- Added `currentUserId` and loaded it from `AuthService`.
	- Added `loadFiles()` to fetch uploaded files from backend.
	- Updated `loadDashboardData()` to keep reminders from mock and files from backend.
	- Updated `uploadPDF()` to:
		- Validate current user session exists.
		- Call real upload service with `file + userId`.
		- Refresh files after upload.
		- Navigate to uploaded file id from backend response (instead of hardcoded id).
- Reason:
	- Prevents fake upload success behavior.
	- Ensures dashboard reflects real uploaded files.

### 5) Dashboard template file field alignment
- File: `phase4_frontend/cognitive-assist-app/src/app/components/dashboard/dashboard.component.html`
- Changes:
	- File display updated from `file.fileName` to `file.title`.
	- Upload date display updated from `file.uploadDate` to `file.uploadedAt` with date pipe formatting.
- Reason:
	- Template must match normalized backend data fields.

### 6) Backend upload endpoint hardening and response normalization
- File: `phase4_backend/app.py`
- Changes:
	- Added imports for `secure_filename` and `uuid`.
	- Added PDF extension whitelist.
	- Added request validation:
		- Missing file
		- Missing `user_id`
		- Empty filename
		- Non-PDF file
		- Unknown user
	- Added unique filename generation to avoid overwrite conflicts.
	- Added `serialize_file()` helper and unified file response format:
		- `id`, `title`, `filePath`, `fileUrl`, `uploadedAt`
	- Updated both `/upload` and `/files/<user_id>` to use the same normalized serializer.
- Reason:
	- Improves API safety and consistency.
	- Guarantees frontend receives predictable fields.

### 7) Backend setup instruction typo fix
- File: `README.md`
- Changes:
	- Corrected `requirement.txt` to `requirements.txt` in backend setup steps.
- Reason:
	- Prevents installation failure due to wrong filename.

## Validation Notes
- Static diagnostics were checked after edits.
- Python file has no reported errors in edited backend file.
- Frontend dependency resolution errors (Angular/RxJS module not found) are environment/package-install related and not introduced by this change.

## Expected Behavior After Fix
1. User logs in and user id is stored.
2. User selects a PDF and uploads it.
3. Frontend sends multipart upload request to backend `/upload`.
4. Backend validates request, stores file, writes DB record, and returns normalized file metadata.
5. Dashboard refreshes file list from backend `/files/{userId}` and shows the new file.
6. Clicking Read opens the uploaded file route using its real file id.
