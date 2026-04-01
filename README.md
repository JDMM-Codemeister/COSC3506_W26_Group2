Group 2  
Topic: Application for assisting cognitive disabilities  
Development Model: Agile  
  Reasoning: Working in sprints will be effective since this course is online and group members can focus on their own sections of the project. Due to the asynchronous nature of the group project, sections can be improved step-by-step, and the project can more easily evolve as we keep implementing features. 

  # Complete User Instructions   



# Instructions to run the app

cd phase4_frontend/cognitive-assist-app
npm install
ng serve 

URL: http://localhost:4200
Login: Any email with '@' + password 
Example: test@example.com / password123

# backend setup 
1. Go to backend folder | cd phase4_backend
2. Install dependencies | pip install -r requirement.txt
3. Run the server | python app.py

Backend runs at: 

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
