# Event Locator API
### Author: Bosco Ishimwe
## Overview

The Event Locator API allows users to interact with event data, such as creating, updating, deleting, and searching for events. The API supports user authentication and authorization to restrict event creation to authenticated users. Additionally, it supports location-based search using geospatial data.

## Features

- **User Authentication & Authorization**  
  - User Registration
  - User Login (JWT Token)
  - Protected Routes for Event Creation (only accessible to authenticated users)
  
- **Event Management**
  - Create an Event
  - Update an Event
  - Delete an Event
  - Get All Events
  - Get an Event by ID
  
- **Location-Based Search**
  - Search for events within a specific radius based on latitude and longitude.

## Technologies Used

- **Node.js** (for the backend)
- **Express.js** (web framework)
- **PostgreSQL** (database with PostGIS for geospatial queries)
- **bcryptjs** (for password hashing)
- **jsonwebtoken (JWT)** (for token-based authentication)
- **pg-pool** (PostgreSQL connection pooling)

## Installation

To get the project up and running, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/event-locator.git
   cd event-locator
2. **Install dependencies:**

```bash
npm install
```
3. **Set up the PostgreSQL database:**

  - Create a database called event_locator.
  - Set up the events table with columns for event details, including a location column of type geometry for storing geospatial data (latitude and longitude).

4. **Set up environment variables:**

  - Create a .env file in the root directory and define the following variables:

```bash
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_locator
JWT_SECRET=your_jwt_secret
Start the server:'''
```

'npm start'
The server will be running on http://localhost:5000.

- **API Endpoints**
  - Authentication
  - POST /api/auth/register
  - Register a new user.

Request Body:

```Json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```
Response:

```
{
  "msg": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
```
- **POST /api/auth/login**
  - Log in a user and receive a JWT token.

Request Body:

```
{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:


```{
  "msg": "Login successful",
  "token": "your_jwt_token"
}
```
5. **Events**
- **POST /api/events**
  - Create a new event (requires authentication).

Request Body:

```Json
{
  "title": "Event Title",
  "description": "Event Description",
  "location": "POINT(longitude latitude)",  // GeoJSON point
  "datetime": "2025-05-01T10:00:00",
  "category_id": 1,
  "created_by": 1
}
```
- **PUT /api/events/:id**
  - Update an event by ID (requires authentication).

Request Body:

```Json
{
  "title": "Updated Event Title",
  "description": "Updated Description",
  "location": "POINT(longitude latitude)",
  "datetime": "2025-06-01T10:00:00",
  "category_id": 2,
  "created_by": 1
}
```
- **DELETE /api/events/:id**
  - Delete an event by ID (requires authentication).

- **GET /api/events**
  - Get all events.
  - GET /api/events/:id
  - Get an event by ID.

- **GET /api/events/search**
  - Search for events within a radius of a point (latitude, longitude).

- **Query Parameters:**
  - latitude (required)
  - longitude (required)
  - radius (required in meters)
  - Example:
```/api/events/search?latitude=-1.9781&longitude=30.1342&radius=5000```

- **Middleware**
  - Authentication Middleware: Verifies the presence and validity of the JWT token in the request headers for protected routes.
  - Authorization Middleware: Ensures that only authenticated users can create or modify events.

- **Known Limitations**
  - The current geospatial search implementation uses the ST_DWithin function from PostGIS, which is effective for small radius searches. However, for larger datasets or more complex geospatial queries, performance might degrade.
  - The application doesn't have an admin role or role-based access control (RBAC) for finer authorization control. For now, any authenticated user can create events.
  - Error handling is basic, and detailed validation for inputs and edge cases (e.g., for location, datetime) can be improved.

- **Improvement**
  - Implement role-based access control (RBAC).
  - Add pagination or filtering to event search for better performance when the number of events grows.
  - Implement event category management (e.g., creating and associating categories with events).
  - Improve error handling and validation on inputs.

## Database Schema

**Users Table**
| Column      | Type                 | Description                  |
|------------|----------------------|------------------------------|
| id         | SERIAL PRIMARY KEY   | Unique user ID               |
| name       | VARCHAR(100)         | User's full name             |
| email      | VARCHAR(100) UNIQUE  | User's email (must be unique) |
| password   | TEXT                 | Hashed password              |
| created_at | TIMESTAMP DEFAULT NOW() | Timestamp of user creation |

**Categories Table**
| Column      | Type                 | Description                  |
|------------|----------------------|------------------------------|
| id         | SERIAL PRIMARY KEY   | Unique category ID           |
| name       | VARCHAR(50) UNIQUE   | Name of the category         |
| created_at | TIMESTAMP DEFAULT NOW() | Timestamp of category creation |

**Events Table**
| Column      | Type                      | Description                  |
|------------|--------------------------|------------------------------|
| id         | SERIAL PRIMARY KEY       | Unique event ID              |
| title      | VARCHAR(255)             | Event title                  |
| description| TEXT                     | Description of the event      |
| location   | GEOMETRY(Point, 4326)    | Geospatial point for event location |
| longitude  | DOUBLE PRECISION         | Longitude coordinate         |
| latitude   | DOUBLE PRECISION         | Latitude coordinate          |
| datetime   | TIMESTAMP                | Date and time of the event   |
| category_id | INTEGER REFERENCES categories(id) | Foreign key linking to categories |
| created_by | INTEGER REFERENCES users(id) ON DELETE CASCADE | Foreign key linking to users |
| created_at | TIMESTAMP DEFAULT NOW()  | Timestamp of event creation  |


### License
  This project is licensed under the MIT License - see the LICENSE file for details.


### Explanation:
- **Setup Instructions:** A clear step-by-step guide to set up the project, install dependencies, set up the database, and start the server.
- **API Documentation:** Describes the available API endpoints for authentication and event management, including request and response examples.
- **Middleware Section:** Explains the authentication and authorization middleware used to secure routes.
- **Known Limitations & TODO:** Highlights areas of improvement and features yet to be implemented, such as role-based access control (RBAC) and event categories.
-  **Database Schema:** Highlight how each part of the app data is represented in the PostgreSQL database such as events, users, and categories. 
- **License:** Provides a section for licensing, which can be modified according to the actual project license.

