# BookTracker — Systems Analysis Final Project

A full-stack book tracking and social reading platform built with **Spring Boot** (backend) and **React + Vite** (frontend).

> **Clone the project first:**
> ```bash
> git clone https://github.com/justpr09rammer/SystemsAnalysisFinalProject
> cd SystemsAnalysisFinalProject
> ```

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Backend Setup](#backend-setup)
   - [Create the MySQL Database](#1-create-the-mysql-database)
   - [Create application.properties](#2-create-applicationproperties)
   - [Set Up Gmail App Password](#3-set-up-gmail-app-password)
   - [Run the Backend](#4-run-the-backend)
   - [Create an Admin User](#5-create-an-admin-user)
5. [Frontend Setup](#frontend-setup)
   - [Create the .env File](#1-create-the-env-file)
   - [Install Dependencies & Run](#2-install-dependencies--run)
6. [Using the Application](#using-the-application)
7. [API Documentation (Swagger)](#api-documentation-swagger)
8. [Project Structure](#project-structure)
9. [Troubleshooting](#troubleshooting)

---

## Project Overview

BookTracker is a reading management application where users can:

- Browse and search books (with OpenLibrary import support)
- Manage personal bookshelves (Want to Read, Currently Reading, Read)
- Track reading progress and set yearly reading challenges
- Write and like reviews
- Follow other readers and view an activity feed
- Admins can manage users, books, authors, and genres

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 4, Spring Security, JWT |
| Database | MySQL 8 |
| ORM | Spring Data JPA / Hibernate |
| API Docs | Springdoc OpenAPI (Swagger UI) |
| Frontend | React 19, Vite 8, Axios |
| Auth | JWT Bearer Tokens |
| Email | Gmail SMTP (verification emails) |

---

## Prerequisites

Make sure the following are installed on your machine before starting:

- **Java 17** — [Download](https://adoptium.net/)
- **Gradle** — bundled via the `gradlew` wrapper (no separate install needed)
- **MySQL 8+** — [Download](https://dev.mysql.com/downloads/mysql/)
- **Node.js 20+** — [Download](https://nodejs.org/)
- **npm** — comes bundled with Node.js
- A **Gmail account** for sending verification emails

---

## Backend Setup

### 1. Create the MySQL Database

Open your MySQL client (MySQL Workbench, TablePlus, or terminal) and run:

```sql
CREATE DATABASE forsad;
```

> The database name must be exactly `forsad` to match the configuration below.

---

### 2. Create `application.properties`

In the project root, navigate to:

```
src/main/resources/
```

> If the `resources` directory does not exist, create it:
> ```
> src/
>  └── main/
>       └── resources/      ← create this folder
>            └── application.properties   ← create this file
> ```

Paste the following content into `application.properties`:

```properties
spring.application.name=SystemAnalysisFinalProjectApplication

# MySQL Database Connection
spring.datasource.url=jdbc:mysql://localhost:3306/forsad
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Gmail SMTP — fill in your own credentials (see step 3 below)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_GMAIL_ADDRESS@gmail.com
spring.mail.password=YOUR_GMAIL_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# JWT Security
security.jwt.secret-key=${JWT_SECRET_KEY:}
security.jwt.expiration-time=3600000
jwt.expirationInMinutes=60
jwt.secret=${JWT_SECRET_KEY:test-secret}

# Swagger / OpenAPI
springdoc.api-docs.enabled=true
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/api-docs
springdoc.version=1.0.0
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.operationsSorter=alpha
```

> **Important:** Replace `root` / `root` with your actual MySQL username and password if they differ. Replace the Gmail fields with real values as described in step 3.

---

### 3. Set Up Gmail App Password

The application sends a verification email every time a new user registers. You need to provide a Gmail account and a special **App Password** (not your regular Gmail password).

**Steps to generate a Gmail App Password:**

1. Go to your Google Account: [https://myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left sidebar.
3. Under "How you sign in to Google", enable **2-Step Verification** if not already active.
4. After enabling 2-Step Verification, go back to **Security** and search for **"App passwords"** (or visit [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
5. Select **"Mail"** as the app and **"Other"** as the device. Name it something like `BookTracker`.
6. Click **Generate** — you will receive a 16-character password like `abcd efgh ijkl mnop`.
7. Copy that password (without spaces).

Now update `application.properties`:

```properties
spring.mail.username=your.email@gmail.com
spring.mail.password=abcdefghijklmnop
```

> Every new user who registers will receive a 6-digit verification code at their email address before their account is activated.

---

### 4. Run the Backend

From the project root directory, run:

**On macOS / Linux:**
```bash
./gradlew bootRun
```

**On Windows:**
```bash
gradlew.bat bootRun
```

The backend will start on **http://localhost:8080**.

You should see output similar to:
```
Started SystemsAnalysisFinalProjectApplication in X.XXX seconds
```

> All database tables are created automatically by Hibernate on first run (`spring.jpa.hibernate.ddl-auto=update`). You do not need to run any SQL migration scripts.

---

### 5. Create an Admin User

After the backend is running, you can register a user through the API or the frontend. To promote a user to Admin, you need to manually update the database:

1. Register a user normally (via frontend or Swagger UI).
2. Verify the account using the code sent to the email.
3. Open your MySQL client and run:

```sql
USE forsad;
UPDATE users SET user_role = 'ADMIN' WHERE email = 'your.email@example.com';
```

Replace `your.email@example.com` with the email address you registered with.

> Admin users can import books from OpenLibrary, manage all users, authors, genres, and delete any review.

---

## Frontend Setup

### 1. Create the `.env` File

Navigate into the `front` directory:

```bash
cd front
```

Create a file named `.env` in that directory:

```
front/
 └── .env    ← create this file
```

Add the following content:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

This tells the React app where the backend API is hosted. Do not change this unless you deploy the backend to a different address.

---

### 2. Install Dependencies & Run

Make sure you are inside the `front` directory, then run:

```bash
npm install
npm run dev
```

The frontend will start on **http://localhost:3000**.

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) — the homepage will be available.

---

## Using the Application

### Registration Flow

1. Open [http://localhost:3000](http://localhost:3000).
2. Click **Create Account** and fill in your details.
3. Check your email inbox for a 6-digit verification code.
4. Enter the code on the verification page to activate your account.
5. Log in and start using the app.

### Key Features

| Feature | How to Access |
|---|---|
| Browse books | Homepage / Explore page |
| Search books | Search bar at the top |
| Add to shelf | Book detail page → shelf dropdown |
| Track progress | Book detail page → enter current page |
| Write a review | Book detail page → Reviews section |
| Follow users | User profile page |
| Reading challenge | Progress page → Set yearly goal |
| Admin panel | Admin page (admin accounts only) |
| Import books | Swagger UI → `POST /api/v1/books/import` |

---

## API Documentation (Swagger)

While the backend is running, visit:

```
http://localhost:8080/swagger-ui.html
```

You can explore and test all available API endpoints directly from the browser. To test authenticated endpoints:

1. Use `POST /api/v1/auth/login` to get a JWT token.
2. Click the **Authorize** button (top right in Swagger UI).
3. Enter `Bearer YOUR_TOKEN_HERE` and click **Authorize**.

---

## Project Structure

```
SystemsAnalysisFinalProject/
├── src/
│   ├── main/
│   │   ├── java/com/example/systemsanalysisfinalproject/
│   │   │   ├── Controller/        # REST controllers (Books, Authors, Genres, etc.)
│   │   │   ├── DTOs/              # Request & Response data transfer objects
│   │   │   ├── Model/             # JPA entities (Book, Shelf, Review, Follow, etc.)
│   │   │   ├── Repository/        # Spring Data JPA repositories
│   │   │   ├── Service/           # Business logic layer
│   │   │   └── Security/          # JWT auth, Spring Security config, User model
│   │   └── resources/
│   │       └── application.properties   ← you create this
│   └── test/
│       └── java/                  # Unit tests for all controllers
├── front/                         # React + Vite frontend
│   ├── src/
│   │   ├── api/                   # Axios configuration
│   │   ├── components/            # Reusable UI components
│   │   ├── context/               # AuthContext (global auth state)
│   │   ├── hooks/                 # Custom hooks (useAsync, useToast)
│   │   ├── pages/                 # Page components (Home, Explore, Library, etc.)
│   │   └── services/              # API service layer
│   ├── .env                       ← you create this
│   └── vite.config.js
├── build.gradle                   # Backend dependencies
└── gradlew / gradlew.bat          # Gradle wrapper scripts
```

---

## Troubleshooting

**Backend won't start — database connection refused**
- Make sure MySQL is running on port 3306.
- Confirm the `forsad` database exists: `SHOW DATABASES;`
- Check the username/password in `application.properties` matches your MySQL setup.

**Emails not being sent**
- Double-check that 2-Step Verification is enabled on your Google account.
- Make sure you are using the App Password (16 characters), not your regular Gmail password.
- Check the `spring.mail.username` field exactly matches the Gmail address you generated the App Password for.

**Frontend shows "Network Error" or API calls fail**
- Confirm the backend is running on port 8080.
- Confirm the `.env` file exists inside the `front/` directory with `VITE_API_URL=http://localhost:8080/api/v1`.
- Restart the frontend dev server after creating or editing the `.env` file.

**Port 3000 or 8080 already in use**
- Find and stop the process using the port, or change the port in `vite.config.js` (frontend) or `application.properties` (backend: `server.port=8081`).

**`gradlew: Permission denied` on macOS/Linux**
```bash
chmod +x gradlew
./gradlew bootRun
```
