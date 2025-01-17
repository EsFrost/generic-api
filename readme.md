# Generic API Documentation

## Overview

This is a RESTful API built with Express.js that provides authentication and CRUD operations for blog posts. The API uses JWT tokens for authentication and MySQL for data storage.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm

### Installation

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Initialize the database by running the SQL scripts in the `db_related` folder:
   - `tables.sql`: Creates the database schema
   - `dummy_data.sql`: Populates the database with sample data

## API Endpoints

### Authentication

#### Login

- **POST** `/users/login`
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

- **Response:** Returns JWT token in cookie and response body

#### Logout

- **POST** `/users/logout`
- **Auth Required:** Yes
- **Response:** Clears the JWT cookie

### Posts

#### Get All Posts

- **GET** `/posts`
- **Auth Required:** No
- **Response:** Array of all posts

#### Get Single Post

- **GET** `/posts/:id`
- **Auth Required:** No
- **Response:** Single post object

#### Create Post

- **POST** `/posts`
- **Auth Required:** Yes
- **Body:**

```json
{
  "title": "Post Title",
  "content": "Post content goes here"
}
```

#### Update Post

- **PUT** `/posts/:id`
- **Auth Required:** Yes
- **Body:**

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Post

- **DELETE** `/posts/:id`
- **Auth Required:** Yes

## Security Features

- JWT-based authentication
- HTTP-only cookies
- Rate limiting
- Input sanitization
- CORS protection
- Helmet.js security headers

## Testing

The API includes a comprehensive test suite using Jest and Supertest.

1. Install test dependencies:

```bash
npm install --save-dev jest supertest cross-env
```

2. Run tests:

```bash
npm test
```

3. Run tests with coverage:

```bash
npm run test:coverage
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);
```

### Posts Table

```sql
CREATE TABLE posts (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL
);
```

### Categories Table

```sql
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
```

### Posts_Categories Table

```sql
CREATE TABLE posts_categories (
    id CHAR(36) PRIMARY KEY,
    p_id VARCHAR(36) NOT NULL,
    c_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (p_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (c_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 500: Internal Server Error

Error responses follow this format:

```json
{
  "error": "Error message here",
  "details": "Optional additional details"
}
```

## Rate Limiting

The API implements rate limiting with the following defaults:

- Window: 15 minutes
- Max Requests: 100 per window
- This can be configured in `index.js`

## CORS Configuration

CORS is configured to accept requests from:

- `localhost:4200`
- Local IP addresses (192.168.1.\*)

To add additional origins, modify the CORS configuration in `index.js`.
