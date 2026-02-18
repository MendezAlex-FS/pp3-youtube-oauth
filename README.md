# Google OAuth & YouTube Data API

## Project Overview

A full-stack YouTube application that:

- Authenticates users using **Google OAuth 2.0 (PKCE)**
- Stores users in a **MySQL database using Sequelize**
- Issues **JWT session tokens**
- Allows authenticated users to:
  - View their recent YouTube activity
  - Search YouTube videos via the YouTube Data API

## Tech Stack

### Client

- React (Vite)
- TailwindCSS (dark mode enabled via class strategy)
- JWT stored in localStorage

### Server

- Node.js
- Express
- Sequelize (MySQL)
- Google OAuth 2.0 (PKCE)
- YouTube Data API v3
- JSON Web Tokens (JWT)

### Database

- MySQL

## Prerequisites

### Required Software

- **Node.js** v18+
- **npm** v9+
- **MySQL Server** (installed locally)
  - [MySql 8.0.45 for Windows](https://dev.mysql.com/downloads/file/?id=548821)
  - [Other OS](https://dev.mysql.com/downloads/mysql/)

- **Git**
- Modern browser (Chrome / Edge / Firefox)

## Google Cloud Setup

You must have:

- A Google Cloud Project
- OAuth Consent Screen configured
- OAuth Client ID (Web application)
- OAuth Client Secret
- YouTube Data API v3 enabled

### Required OAuth Scopes

```bash
openid
email
profile
https://www.googleapis.com/auth/youtube.readonly
```

## Environment Variables

Create a `.env` file inside the `server` folder:

```bash
# The API port setting
PORT=3001

# Detabase settings
NODE_ENV=development
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
DB_HOST=your_db_host

# Google OAuth settings
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/api/v1/auth/callback

# Client authentication settings
JWT_SECRET=replace_with_strong_secret

# Client related settings
CLIENT_ORIGIN=http://localhost:5173
YOUTUBE_ORIGIN=https://lh3.googleusercontent.com/
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MendezAlex-FS/pp3-youtube-oauth.git
git checkout -b dev origin/dev

cd pp3-youtube-oauth
```

### 2. Install Server

```bash
cd server
npm install

# Create the database - only if does not exist. DB name will be whatever is in DB_NAME=your_db_name in .env file.
# NOTE: IF .ENV VARIABLES ARE NOT SET. YOU WILL GET AN ERROR ON THE COMMAND BELOW.
npm run db:setup

npm run dev
```

### 3. Server runs on

```bash
http://localhost:3001
```

### 4. Install Client

In a separate terminal:

``` bash
cd client
npm install
npm run dev
```

Client runs on:

```bash
http://localhost:5173
```

## Authentication Flow

### 1. Client calls

```bash
GET /api/v1/auth/google/login
```

### 2. User authenticates with Google

### 3. Google redirects to

```bash
/api/v1/auth/google/callback
```

### 4. Server

- Exchanges code for tokens
- Fetches user info
- Stores/updates user in MySQL
- Issues a JWT
- Redirects back to client with session token

### 5. Client stores JWT in localStorage

## API Endpoints

### Authentication

#### Start OAuth

```bash
GET /api/v1/auth/google/login
```

#### OAuth Callback

```bash
GET /api/v1/auth/google/callback
```

#### Get Current User

```bash
GET /api/v1/auth/me
Authorization: Bearer <jwt>
```

#### Check Authentication Status

```bash
GET /api/v1/auth/status
Authorization: Bearer <jwt>
```

#### Logout

```bash
POST /api/v1/auth/logout
Authorization: Bearer <jwt>
```

### YouTube Endpoints (Protected)

All routes require:

```bash
Authorization: Bearer <jwt>
```

#### Search YouTube Videos

```bash
GET /api/v1/youtube/search?q=search_term
```

Example:

```bash
http://localhost:3001/api/v1/youtube/search?q=Module%202
```

#### Get Recent Activity

```bash
GET /api/v1/youtube/recent
```

## Features Implemented

- Google OAuth with PKCE
- JWT session handling
- Sequelize + MySQL integration
- User persistence
- Protected routes with middleware
- YouTube search endpoint
- Recent video retrieval
- Dark mode (Tailwind class strategy)
- Centralized API utilities on client
- Error handling for API responses

## Local Development Links

Client: [http://localhost:5173](http://localhost:5173/)  
Server: [http://localhost:3001](http://localhost:3001)
