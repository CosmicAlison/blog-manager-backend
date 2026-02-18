The Daily Blogger: Full-Stack Containerized Application
A full-stack blog management system built with a decoupled architecture. 
This project demonstrates a JWT secured, stateless REST API integrated with a reactive frontend, all orchestrated using Docker for environment consistency.

1. Technical Stack
Frontend: React, Vite, TypeScript, Tailwind CSS.

Backend: Java 17, Spring Boot, Spring Security, Spring Data JPA.

Database: PostgreSQL 16.

DevOps: Docker, Docker Compose (Multi-stage builds).

2. Architectural Decisions
Decoupled Three-Tier Architecture
The application is split into three distinct layers: Presentation (React), Logic (Spring Boot), and Data (PostgreSQL). This separation ensures that the frontend and backend can be scaled or updated independently.

Stateless Authentication
Authentication is handled via an implementation of Spring Security using JWT. This removes the need for server-side session storage, allowing the backend to remain stateless.

Database Persistence
Data is persisted using Docker Volumes. This ensures that blog posts and user accounts remain intact even if the containers are stopped or removed.

4. Local Deployment (Docker)
Ensure Docker Desktop is running on your machine before starting.

Clone the repository:

Bash
git clone <repository-url>
cd blog-manager-backend
Environment Configuration:
Ensure the .env file in the frontend root contains:
VITE_API_URL=http://localhost:8080/api

Copy the contents of application.properties.example into the application.docker.properties file. 
Generate a jwt secret and paste it into the jwt.secret field. 

Build and Run:

Bash
docker compose up --build -d
Access Points:

Frontend: http://localhost:3000

Backend API: http://localhost:8080

Database: localhost:5432

5. Future Works
If allocated more development time, the following enhancements would be prioritized:

Unit tests to ensure test coverage and bug management.

Currently, the access token is stored client side in React's context. Transitioning the Refresh Token storage from client-side state 
to an HttpOnly cookie to prevent XSS-based theft, and ensure the session does not have to be restarted on page reload.
