# Login API v2.5 — Fullstack API Console

A learning-focused fullstack authentication project built with **Java 17**, **Spring Boot 4**, **JdbcTemplate**, **JWT**, **BCrypt**, **PostgreSQL**, **Vite**, **Tailwind CSS**, and **Vanilla JavaScript**.

The project combines a REST API backend with a browser-based console for testing every endpoint, inspecting requests and responses, and understanding authentication and authorization flows.

> Current branch: `v2.5-js-architecture-migration`

---

## Frontend preview

The interface contains endpoint cards on the left and a live API response inspector on the right.

<!--
Add these files before committing the README:

docs/screenshots/auth-api-console-top.png
docs/screenshots/auth-api-console-bottom.png
-->

<p align="center">
  <img src="docs/screenshots/login-api-top.png" alt="Auth API Console top section" width="100%">
</p>

<p align="center">
  <img src="docs/screenshots/login-api-bottom.png" alt="Auth API Console lower section" width="100%">
</p>

The frontend provides cards for:

- Login
- Register user
- Change PIN
- Show all users as admin
- Search user by ID as admin
- Change user role as admin
- Delete own account
- Current session
- Public user-list debug endpoint

---

## What changed in v2.5

Version 2.5 completes the frontend JavaScript architecture migration.

- Centralized request and response data in `apiResPanelState`
- Centralized request preparation with `setApiRequest()`
- Centralized Fetch execution with `sendApiRequest()`
- Centralized response-state updates and rendering
- Added reusable frontend-only guards
- Added empty-input validation before Fetch
- Added positive-integer validation for user IDs
- Added login and administrator access guards
- Added consistent network-error handling with frontend status `0`
- Added support for `204 No Content` responses
- Separated backend and frontend feedback through `backendMessage` and `frontendMessage`
- Preserved safe request previews by masking PIN values
- Added response Body, Headers, and Payload views

---

## Main features

### Backend

- User registration
- JWT login and current-session validation
- BCrypt PIN hashing
- `USER` and `ADMIN` roles
- Administrator-only endpoints
- Account-owner-only actions
- Runtime role checks against the database
- DTO validation with Jakarta Validation
- Global validation and parameter error handling
- JdbcTemplate persistence
- PostgreSQL support
- MariaDB compatibility for local testing

### Frontend

- Vite + Tailwind CSS interface
- Live backend online/offline indicator
- Current token and access-level indicators
- Endpoint cards grouped as Public, Owner, Admin, and Token
- Request and response inspector
- HTTP method, URL, status, and response-time display
- Body, Headers, and Payload tabs
- Copy and clear controls
- Masked PIN values in request previews
- Frontend validation before requests are sent
- In-memory login session for learning and testing

---

## Technologies

### Backend

- Java 17
- Spring Boot 4.0.6
- Spring Web MVC
- Spring JDBC / JdbcTemplate
- PostgreSQL
- MariaDB JDBC driver
- BCrypt through `spring-security-crypto`
- JJWT 0.12.6
- Maven

### Frontend

- HTML
- Vanilla JavaScript
- Vite 8
- Tailwind CSS 4

---

## Project structure

```text
Login-API-v1/
├── frontend/
│   ├── public/
│   │   ├── background.png
│   │   └── ux-ui-prototype/
│   ├── src/
│   │   ├── main.js
│   │   └── style.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── src/
│   ├── main/
│   │   ├── java/org/yeko/loginapi/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── resources/
│   │       └── application-example.properties
│   └── test/
├── pom.xml
├── requests.http
└── README.md
```

---

## Database

### PostgreSQL

```sql
CREATE TABLE users
(
    user_id   serial PRIMARY KEY,
    user_name varchar(100) NOT NULL UNIQUE,
    user_pin  varchar(255) NOT NULL,
    user_role varchar(20) DEFAULT 'USER' NOT NULL
);
```

### MariaDB / MySQL

```sql
CREATE TABLE users
(
    user_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_name varchar(100) NOT NULL UNIQUE,
    user_pin  varchar(255) NOT NULL,
    user_role varchar(20) DEFAULT 'USER' NOT NULL
);
```

The API never returns the stored PIN hash in public user responses.

---

## Local configuration

The real `application.properties` file is ignored by Git because it contains database credentials and the JWT secret.

Create:

```text
src/main/resources/application.properties
```

Example for PostgreSQL:

```properties
spring.application.name=login-api
server.port=8081

spring.datasource.url=jdbc:postgresql://localhost:5432/login_app_db
spring.datasource.username=postgres
spring.datasource.password=your-password

jwt.secret=replace-with-a-secret-of-at-least-32-bytes
jwt.duration-millis=1800000
```

Example for MariaDB:

```properties
spring.application.name=login-api
server.port=8081

spring.datasource.url=jdbc:mariadb://localhost:3307/login_app_db
spring.datasource.username=root
spring.datasource.password=

jwt.secret=replace-with-a-secret-of-at-least-32-bytes
jwt.duration-millis=1800000
```

Do not commit the real JWT secret or database credentials.

---

## Run the project

### 1. Start the backend

Run the Spring Boot application from IntelliJ IDEA or from the project root:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend URL:

```text
http://localhost:8081
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

The backend currently allows the Vite development origin through CORS.

---

## Authentication flow

1. A user registers with a username and PIN.
2. The backend hashes the PIN with BCrypt.
3. A successful login returns a signed JWT.
4. Protected requests send:

```http
Authorization: Bearer <token>
```

5. The token identifies the user.
6. Authorization checks use the current role stored in the database.

The frontend stores the current token, user ID, and role only in JavaScript memory. Refreshing the page clears the session.

---

## Endpoints

| Access         |   Method | Endpoint                 | Purpose                                        |
|----------------|---------:|--------------------------|------------------------------------------------|
| Public         |   `POST` | `/users`                 | Register a user                                |
| Public         |   `POST` | `/auth/login`            | Login and receive a JWT                        |
| Public / Debug |    `GET` | `/users`                 | List public user profiles                      |
| Token          |    `GET` | `/auth/session`          | Validate the token and return the current user |
| Admin          |    `GET` | `/admin/users`           | List all public user profiles                  |
| Admin          |    `GET` | `/users/{id}`            | Find a public user profile by ID               |
| Admin          |  `PATCH` | `/admin/users/{id}/role` | Change a user's role                           |
| Owner          |  `PATCH` | `/users/{id}/pin`        | Change the authenticated owner's PIN           |
| Owner          | `DELETE` | `/users/{id}`            | Delete the authenticated owner's account       |

### Register

```http
POST /users
Content-Type: application/json
```

```json
{
  "userName": "yeko",
  "userPin": "1234"
}
```

Successful response:

```json
{
  "userId": 1,
  "userName": "yeko",
  "userRole": "USER"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "userName": "yeko",
  "userPin": "1234"
}
```

Successful response:

```json
{
  "token": "<jwt-token>",
  "userId": 1,
  "userName": "yeko",
  "userRole": "USER"
}
```

### Backend message response

Operations that return a text message use a consistent field:

```json
{
  "backendMessage": "Password Updated"
}
```

The frontend may extend a successful or blocked response with its own UI feedback:

```json
{
  "backendMessage": [
    "Password Updated"
  ],
  "frontendMessage": [
    "Login is required",
    "Please login again with the new PIN"
  ]
}
```

---

## Response status codes

|                      Status | Meaning                                               |
|----------------------------:|-------------------------------------------------------|
|                         `0` | Frontend Fetch/network failure                        |
|                    `200 OK` | Successful request                                    |
|               `201 Created` | User created successfully                             |
|           `400 Bad Request` | Invalid request, validation error, or invalid user ID |
|          `401 Unauthorized` | Missing or invalid login/session                      |
|             `403 Forbidden` | Authenticated user lacks permission                   |
|             `404 Not Found` | Requested user was not found                          |
|              `409 Conflict` | Conflicting data, such as an existing username        |
| `500 Internal Server Error` | Unexpected backend or database error                  |

---

## Security notes

- PINs are hashed with BCrypt and are never stored as plain text.
- PIN hashes are not included in public API responses.
- JWT secrets and database credentials belong only in the ignored local configuration file.
- Administrator permissions are checked against the current database role.
- PINs are masked in the frontend Payload preview.
- The public `GET /users` endpoint exists for development and should be protected or removed before a production deployment.
- This project uses custom JWT authorization logic for learning purposes and is not presented as production-ready authentication infrastructure.

---

## Current status

### Completed in v2.5

- Backend authentication and authorization flow
- BCrypt PIN protection
- JWT login and session validation
- PostgreSQL / JdbcTemplate persistence
- Public, owner, administrator, and token endpoints
- Full frontend API console
- Centralized frontend request/response architecture
- Reusable authentication and input guards
- Consistent backend/frontend messages
- Live request and response inspection

### Possible future improvements

- Logged-in / logout mode inside the Login card
- Responsive layout for smaller screens
- Persistent session storage when appropriate
- Loading and disabled-button states during requests
- Unit and integration tests
- Docker configuration
- Deployment configuration
- Spring Security filter-chain integration

---

## Purpose

This repository documents my progress while learning backend and fullstack development. The goal is to understand each layer directly: database access, authentication, authorization, API design, frontend state, Fetch requests, validation, and UI feedback.
