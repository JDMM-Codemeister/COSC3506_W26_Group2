Group 2  
Topic: Application for assisting cognitive disabilities  
Development Model: Agile  
  Reasoning: Working in sprints will be effective since this course is online and group members can focus on their own sections of the project. Due to the asynchronous nature of the group project, sections can be improved step-by-step, and the project can more easily evolve as we keep implementing features.  


  # SETUP POSTGRES DB (port: 5432)
1. Install Docker Desktop
2. Open Docker Desktop
3. docker compose up -d //start container
4. docker compose exec db psql -U username -d password //verify db created

# QUIT POSTGRES DB
1. \q //close postgres
2. docker compose down (keep data)
3. docker compose down -v (wipe data)



