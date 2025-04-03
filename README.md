# Event Locator API

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
   git clone https://github.com/ISHIMWE-Bosco/event-locator.git
   cd event-locator
   
2. **Install dependencies:**
   
bash
Copy
Edit
npm install
Set up the PostgreSQL database:

Create a database called event_locator.

Set up the events table with columns for event details, including a location column of type geometry for storing geospatial data (latitude and longitude).

Set up environment variables:

Create a .env file in the root directory and define the following variables:

env
Copy
Edit
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_locator
JWT_SECRET=your_jwt_secret
Start the server:

bash
Copy
Edit
npm start
The server will be running on http://localhost:5000.

API Endpoints
Authentication
POST /api/auth/register
Register a new user.

Request Body:

json
Copy
Edit
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
Response:

json
Copy
Edit
{
  "msg": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name"
  }
}
POST /api/auth/login
Log in a user and receive a JWT token.

Request Body:

json
Copy
Edit
{
  "email": "user@example.com",
  "password": "password123"
}
Response:

json
Copy
Edit
{
  "msg": "Login successful",
  "token": "your_jwt_token"
}
Events
POST /api/events
Create a new event (requires authentication).

Request Body:

json
Copy
Edit
{
  "title": "Event Title",
  "description": "Event Description",
  "location": "POINT(longitude latitude)",  // GeoJSON point
  "datetime": "2025-05-01T10:00:00",
  "category_id": 1,
  "created_by": 1
}
PUT /api/events/:id
Update an event by ID (requires authentication).

Request Body:

json
Copy
Edit
{
  "title": "Updated Event Title",
  "description": "Updated Description",
  "location": "POINT(longitude latitude)",
  "datetime": "2025-06-01T10:00:00",
  "category_id": 2,
  "created_by": 1
}
DELETE /api/events/:id
Delete an event by ID (requires authentication).

GET /api/events
Get all events.

GET /api/events/:id
Get an event by ID.

GET /api/events/search
Search for events within a radius of a point (latitude, longitude).

Query Parameters:

latitude (required)

longitude (required)

radius (required in meters)

Example: /api/events/search?latitude=-1.9781&longitude=30.1342&radius=5000

Middleware
Authentication Middleware: Verifies the presence and validity of the JWT token in the request headers for protected routes.

Authorization Middleware: Ensures that only authenticated users can create or modify events.

Known Limitations
The current geospatial search implementation uses the ST_DWithin function from PostGIS, which is effective for small radius searches. However, for larger datasets or more complex geospatial queries, performance might degrade.

The application doesn't have an admin role or role-based access control (RBAC) for finer authorization control. For now, any authenticated user can create events.

Error handling is basic, and detailed validation for inputs and edge cases (e.g., for location, datetime) can be improved.

TODO
Implement role-based access control (RBAC).

Add pagination or filtering to event search for better performance when the number of events grows.

Implement event category management (e.g., creating and associating categories with events).

Improve error handling and validation on inputs.

License
This project is licensed under the MIT License - see the LICENSE file for details.

vbnet
Copy
Edit

### Explanation:
- **Setup Instructions:** A clear step-by-step guide to set up the project, install dependencies, set up the database, and start the server.
- **API Documentation:** Describes the available API endpoints for authentication and event management, including request and response examples.
- **Middleware Section:** Explains the authentication and authorization middleware used to secure routes.
- **Known Limitations & TODO:** Highlights areas of improvement and features yet to be implemented, such as role-based access control (RBAC) and event categories.
- **License:** Provides a section for licensing, which can be modified according to the actual project license.

This should give a comprehensive overview of the project, making it easier for someone new to understand
