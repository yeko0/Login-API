# Login API v2.8 — Fullstack API Console

A learning-focused fullstack authentication project built with **Java 17**, **Spring Boot 4**, **Spring Data JPA / Hibernate**, **JWT**, **BCrypt**, **PostgreSQL / MariaDB**, **Vite**, **Tailwind CSS**, and **Vanilla JavaScript**.

The project combines a REST API backend with a browser-based console for testing every endpoint, inspecting requests and responses, and understanding authentication, authorization, database persistence, and frontend request flows.

> Current branch: `v2.8-jpa-polish`

---

## Frontend preview

The interface contains endpoint cards on the left and a live API response inspector on the right.

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

## Version history

### v2.6 — Project structure

Version 2.6 reorganized the repository into a clearer fullstack structure.

- Moved the Spring Boot application into `backend/`
- Kept the Vite frontend inside `frontend/`
- Centralized shared repository files in the project root
- Updated the project layout to better represent a fullstack monorepo
- Kept backend and frontend as independent runnable projects

### v2.7 — JPA migration

Version 2.7 migrated the backend persistence layer from `JdbcTemplate` to **Spring Data JPA**.

- Added `spring-boot-starter-data-jpa`
- Converted `User` into a JPA entity with `@Entity`, `@Table`, `@Id`, and `@Column`
- Replaced manual repository methods with `JpaRepository`
- Migrated common CRUD operations to JPA methods such as `findAll`, `findById`, `save`, and `delete`
- Added Spring Data query methods such as `findByUserName`, `existsByUserName`, and `countByUserRole`
- Removed the old `JdbcTemplate` repository after the migration was complete

### v2.8 — JPA polish

Version 2.8 cleaned up and improved the new JPA backend.

- Renamed the JPA repository back to `UserRepository` after removing the old JDBC implementation
- Removed the unused direct JDBC starter dependency
- Disabled `spring.jpa.open-in-view`
- Added database exception handling through `GlobalExceptionHandler`
- Changed `ApiMessage` to support multiple backend message lines with `List<String>`
- Simplified user creation by returning `UserResponse` directly instead of wrapping it in `Optional`
- Added DTO projections for public user reads so public responses do not load `userPin`
- Added a specific role-update query with `@Modifying` so role changes do not touch the PIN hash
- Added role constants and a set of valid roles for cleaner role validation

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
- Global validation, parameter, and database error handling
- Spring Data JPA persistence
- DTO projections for public user responses
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
- Spring Data JPA
- Hibernate
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
├── backend/
│   ├── .mvn/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/org/yeko/loginapi/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── repository/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       └── application-example.properties
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── requests.http
│
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
│
├── docs/
│   └── screenshots/
├── README.md
├── .gitignore
└── .gitattributes
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

The API never returns the stored PIN hash in public user responses. Public user reads use DTO projections that only select `userId`, `userName`, and `userRole`.

---

## Local configuration

The real `application.properties` file is ignored by Git because it contains database credentials and the JWT secret.

Create:

```text
backend/src/main/resources/application.properties
```

Example for PostgreSQL:

```properties
spring.application.name=login-api
server.port=8081

spring.datasource.url=jdbc:postgresql://localhost:5432/login_app_db
spring.datasource.username=postgres
spring.datasource.password=your-password

spring.jpa.open-in-view=false

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

spring.jpa.open-in-view=false

jwt.secret=replace-with-a-secret-of-at-least-32-bytes
jwt.duration-millis=1800000
```

Do not commit the real JWT secret or database credentials.

---

## Run the project

### 1. Start the backend

Run the Spring Boot application from IntelliJ IDEA or from the backend folder:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend
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
7. Public user responses never include the stored PIN hash.

The frontend stores the current token, user ID, and role only in JavaScript memory. Refreshing the page clears the session.

---

## Endpoints

| Access         | Method   | Endpoint                 | Purpose                                        |
|----------------|----------|--------------------------|------------------------------------------------|
| Public         | `POST`   | `/users`                 | Register a user                                |
| Public         | `POST`   | `/auth/login`            | Login and receive a JWT                        |
| Public / Debug | `GET`    | `/users`                 | List public user profiles                      |
| Token          | `GET`    | `/auth/session`          | Validate the token and return the current user |
| Admin          | `GET`    | `/admin/users`           | List all public user profiles                  |
| Admin          | `GET`    | `/users/{id}`            | Find a public user profile by ID               |
| Admin          | `PATCH`  | `/admin/users/{id}/role` | Change a user's role                           |
| Owner          | `PATCH`  | `/users/{id}/pin`        | Change the authenticated owner's PIN           |
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

Operations that return a text message use a consistent field with a list of message lines:

```json
{
  "backendMessage": [
    "Password Updated"
  ]
}
```

Some responses may include multiple backend message lines:

```json
{
  "backendMessage": [
    "User data conflict",
    "Try again"
  ]
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

| Status                      | Meaning                                               |
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
- Public user read queries use DTO projections and do not select `userPin`.
- JWT secrets and database credentials belong only in the ignored local configuration file.
- Administrator permissions are checked against the current database role.
- The last remaining administrator cannot be downgraded to `USER`.
- PINs are masked in the frontend Payload preview.
- The public `GET /users` endpoint exists for development and should be protected or removed before a production deployment.
- This project uses custom JWT authorization logic for learning purposes and is not presented as production-ready authentication infrastructure.

---

## Current status

### Completed by v2.8

- Backend authentication and authorization flow
- BCrypt PIN protection
- JWT login and session validation
- Full migration from `JdbcTemplate` to Spring Data JPA
- JPA entity mapping for `User`
- Spring Data repository methods and custom JPQL queries
- DTO projections for public user responses
- Public, owner, administrator, and token endpoints
- Full frontend API console
- Centralized frontend request/response architecture
- Reusable authentication and input guards
- Consistent backend/frontend messages
- Global validation, parameter, and database exception handling
- Live request and response inspection
- Fullstack repository structure with separate `backend/` and `frontend/` folders

### Possible future improvements

- React migration for the frontend
- Logged-in / logout mode inside the Login card
- Responsive layout for smaller screens
- Persistent session storage when appropriate
- Loading and disabled-button states during requests
- Unit and integration tests
- Docker configuration
- Deployment configuration
- Spring Security filter-chain integration
- Optional role enum instead of string-based roles
- Protect or remove the public debug `/users` endpoint before production

---

## Purpose

This repository documents my progress while learning backend and fullstack development. The goal is to understand each layer directly: database access, authentication, authorization, API design, frontend state, Fetch requests, validation, and UI feedback.

The persistence layer intentionally evolved step by step from manual approaches to `JdbcTemplate` and finally to Spring Data JPA, so the project shows both learning progress and a cleaner modern backend structure.
