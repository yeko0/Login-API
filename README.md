# Login API v1

Login API built with **Java**, **Spring Boot**, **JDBC** and **PostgreSQL**.

This project is a backend REST API for user registration, login, JWT authentication, role-based authorization and account management.

## Features

- User registration
- Login with JWT
- BCrypt PIN hashing
- `Authorization: Bearer <token>` authentication
- `USER` and `ADMIN` roles
- Admin-only endpoints
- Account-owner-only endpoints
- Role validation
- Current session endpoint
- PostgreSQL database connection using JDBC
- DTO validation with `@Valid` and `@NotBlank`

## Technologies

- Java 17
- Spring Boot 4.0.6
- Spring Web MVC
- Spring JDBC
- PostgreSQL
- MariaDB driver for school/local testing
- BCrypt via `spring-security-crypto`
- JWT with JJWT
- Maven

## Database

Main table:

```sql
CREATE TABLE users
(
    user_id   serial PRIMARY KEY,
    user_name varchar(100) NOT NULL UNIQUE,
    user_pin  varchar(100) NOT NULL,
    user_role varchar(20) DEFAULT 'USER' NOT NULL
);
```

### Columns

| Column      | Description                  |
|-------------|------------------------------|
| `user_id`   | Unique user id               |
| `user_name` | Unique username              |
| `user_pin`  | BCrypt-hashed PIN            |
| `user_role` | User role: `USER` or `ADMIN` |

## Configuration

Example `application.properties`:

```properties
spring.application.name=login-api
spring.datasource.url=jdbc:postgresql://localhost:5432/login_app_db
spring.datasource.username=postgres
spring.datasource.password=postgres
server.port=8081

jwt.secret=this-is-my-super-secret-key-for-learning-login-Jwt
jwt.duration-millis=1800000 (30minutes)
```

## Authentication

After login, the API returns a JWT token.

Protected endpoints require this header:

```http
Authorization: Bearer <token>
```

The JWT is used to identify the user.  
User roles are checked directly from the database, so role changes apply immediately even if an old token still exists.

## Endpoints

### Public endpoints

#### Create user

```http
POST /users
Content-Type: application/json
```

Request body:

```json
{
  "userName": "yeko",
  "userPin": "1234"
}
```

Response example:

```json
{
  "userId": 1,
  "userName": "yeko",
  "userRole": "USER"
}
```

New users are created with the default role `USER`.

---

#### Login

```http
POST /auth/login
Content-Type: application/json
```

Request body:

```json
{
  "userName": "yeko",
  "userPin": "1234"
}
```

Response example:

```json
{
  "token": "<jwt-token>",
  "userId": 1,
  "userName": "yeko",
  "userRole": "USER"
}
```

---

### Authenticated endpoints

#### Get current session

```http
GET /auth/session
Authorization: Bearer <token>
```

Returns the current user based on the token.

Response example:

```json
{
  "userId": 1,
  "userName": "yeko",
  "userRole": "USER"
}
```

---

### Admin endpoints

#### Get all users

```http
GET /admin/users
Authorization: Bearer <admin-token>
```

Requires role:

```text
ADMIN
```

Response example:

```json
[
  {
    "userId": 1,
    "userName": "yeko",
    "userRole": "USER"
  },
  {
    "userId": 2,
    "userName": "admin",
    "userRole": "ADMIN"
  }
]
```

---

#### Get user by id

```http
GET /users/{id}
Authorization: Bearer <admin-token>
```

Requires role:

```text
ADMIN
```

Response example:

```json
{
  "userId": 1,
  "userName": "yeko",
  "userRole": "USER"
}
```

---

#### Update user role

```http
PATCH /admin/users/{id}/role
Authorization: Bearer <admin-token>
Content-Type: application/json
```

Request body:

```json
{
  "userRole": "ADMIN"
}
```

Allowed roles:

```text
USER
ADMIN
```

The API normalizes role input:

```text
" admin " → "ADMIN"
"user"    → "USER"
```

The API does not allow changing the last remaining `ADMIN` to `USER`.

Response example:

```json
{
  "message": "Role Updated"
}
```

---

### Account owner endpoints

These endpoints require that the token belongs to the same user id in the URL.

#### Update own PIN

```http
PATCH /users/{id}/pin
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "userName": "yeko",
  "userPin": "1234",
  "newUserPin": "9999"
}
```

Response example:

```json
{
  "message": "Password Updated"
}
```

---

#### Delete own account

```http
DELETE /users/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

Request body:

```json
{
  "userName": "yeko",
  "userPin": "9999"
}
```

Response example:

```json
{
  "message": "User yeko Deleted"
}
```

---

### Debug endpoint

#### Get all users without authentication

```http
GET /users
```

This endpoint is currently public for development/debugging.

It can be used to quickly verify that the application is connected to the database.

## Error response

Most denied requests return:

```json
{
  "message": "Access Denied"
}
```

Validation errors are handled by Spring validation using DTO annotations like `@NotBlank`.

## Project structure

```text
controller
├── AuthController
└── UserController

service
├── AuthService
├── JwtService
├── PasswordService
└── UserService

repository
└── UserRepository

dto
├── ApiMessage
├── CreateUserRequest
├── DeleteUserRequest
├── LoginRequest
├── LoginResponse
├── UpdatePinRequest
├── UpdateRoleRequest
└── UserResponse

entity
└── User
```

## Security notes

- User PINs are never stored as plain text.
- PINs are hashed with BCrypt.
- JWT tokens are signed with a secret from `application.properties`.
- Admin permissions are checked against the current database role, not only against token claims.
- Role changes take effect immediately for protected admin endpoints.
- The token contains identity data such as `userId` and `userName`, but role permissions are resolved from the database.

## Example authorization header

```http
Authorization: Bearer <jwt-token>
```

## Current project status

This is version 1 of the Login API.

Implemented:

- User registration
- Login
- JWT generation and validation
- BCrypt PIN hashing
- Role-based authorization
- Admin endpoints
- Account owner endpoints
- Session endpoint
- JDBC-based PostgreSQL persistence

Planned future improvements:

- Spring Security filter-based authentication
- Refresh tokens
- Tests
- Docker setup
- Better error response model
- Deployment
- Optional frontend demo
