# Kindora Backend

## Project Overview

Kindora is a community volunteering platform that connects people with meaningful social initiatives. This repository contains the backend API responsible for event management, volunteer registration, and secure user authentication.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Better Auth (JWT Authentication)
- JOSE
- CORS
- Nodemon (Development)

## Key Features

- Secure API access using JWT verification.
- Create, update, and delete events.
- Retrieve upcoming events.
- View individual event details.
- Join community events.
- One participant can join multiple different events but cannot join the same event twice.
- View joined events by user email.
- Manage events created by users.
- Verify user identity through authenticated API requests.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Wasima230Sultana/Kindora_server
   ```

2. Navigate to the project directory:

   ```bash
   cd Kindora-server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the required environment variables.

5. Start the development server:

   ```bash
   nodemon index.js
   ```

## Environment Variables

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
CLIENT_URL=your_frontend_url
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check server status |
| POST | `/create-event` | Create a new event |
| GET | `/create-event` | Get recent events |
| GET | `/upcoming-events` | Get all upcoming events |
| GET | `/upcoming-events/:id` | Get event details |
| PATCH | `/manage-event/:id` | Update an event |
| DELETE | `/upcoming-events/:id` | Delete an event |
| POST | `/joined-event` | Join an event |
| GET | `/joined-event/:email` | Get joined events |
| DELETE | `/joined-event/:id` | Cancel event registration |
| GET | `/manage-event/:email` | Get events created by a user |

## Authentication

Protected routes use JWT authentication with Better Auth's JWKS endpoint. Requests must include a valid Bearer token in the Authorization header.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Database

MongoDB database: `kindora_resources`

Collections:
- `events`
- `joined-event`

## License

This project is developed for educational purposes.