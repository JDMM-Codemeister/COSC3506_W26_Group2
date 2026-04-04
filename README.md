Group 2  
Topic: Application for assisting cognitive disabilities  
Development Model: Agile  
  Reasoning: Working in sprints will be effective since this course is online and group members can focus on their own sections of the project. Due to the asynchronous nature of the group project, sections can be improved step-by-step, and the project can more easily evolve as we keep implementing features. 

  # Complete User Instructions   
1. Start the backend (start it first)

Open a terminal and run:

cd phase4_backend
pip install -r requirements.txt
python app.py

Backend runs at:
http://localhost:5000

2. Start the frontend

Open a new terminal (Do not close step 1's terminal)

then run:

cd phase4_frontend/cognitive-assist-app
npm install
npm start

Frontend runs at:
http://localhost:4200

3. Check frontend API config

Make sure the frontend environment file points to the backend server:

File:
phase4_frontend/cognitive-assist-app/src/environments/environment.ts

Use:
apiUrl: 'http://localhost:5000'

4. Use the app

After both backend and frontend are running:

1. Open http://localhost:4200
2. Register or login
3. Go to dashboard
4. Upload a PDF

Notes

Backend must be started before frontend upload will work
If upload says success but nothing changes, check whether the backend is running
Also check whether the API URL in environment.ts is correct


# API

Register:
POST /register

EX:
{
  "fullname": "Alex He"
  "email": "alex@test.com"
  "password": "123456"
}

Login:
POST /login

EX{
  "email": "alex@test.com"
  "password": "123456"
}

# Database

This database uses SQLite
Database created automatically when you run the app
no manual setup needed
