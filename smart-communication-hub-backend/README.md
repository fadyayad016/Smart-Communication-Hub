# Smart Communication Hub - Backend

This repository contains the NestJS backend for the V.Connct Smart Communication Hub. It provides the REST API, WebSocket gateway, and database logic for the application.

##  Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Real-time:** Socket.io
* **Authentication:** JWT (Passport.js)

---

## ⚙️ Setup and Installation

1.  **Navigate to the backend folder**
    ```bash
    cd smart-communication-hub-backend
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Set up environment variables**
    Create a `.env` file in this directory and add the following:
    ```env
    # .env
    DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"
    JWT_SECRET="YOUR_SUPER_SECRET_KEY"
    ```
4.  **Run database migrations**
    ```bash
    npx prisma migrate dev
    ```

---

## ▶️ Running the Application

```bash
# Development mode (with hot-reloading)
npm run start:dev or nest start


---

## 📋 API Documentation

The backend provides a RESTful API for handling users, messages, and insights, along with a WebSocket gateway for real-time communication.

### REST API Endpoints

All endpoints are assumed to be prefixed with `/api`. All routes marked with **JWT** require a valid Bearer token.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| `POST` | `/api/auth/register` | **No** | Creates a new user account. <br> **Body:** `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | **No** | Logs in a user and returns an `accessToken`. <br> **Body:** `{ "email": "...", "password": "..." }` |
| `GET` | `/api/auth/profile` | **JWT** | Fetches the profile of the currently authenticated user. |
| **Users** | | | |
| `GET` | `/api/users` | **JWT** | Fetches a list of all users (excluding the current user). |
| **Messages** | | | |
| `GET` | `/api/messages/conversation` | **JWT** | Fetches the message history with a specific user. <br> **Query Params:** `?targetUserId=...` |
| `POST` | `/api/messages` | **JWT** | Submits a new message. This is saved to the DB and broadcast via WebSocket. <br> **Body:** `{ "receiverId": "...", "text": "..." }` |
| `GET` | `/api/messages/search` | **JWT** | Searches for messages within a specific conversation. <br> **Query Params:** `?targetUserId=...&q=...` |
| **Insights** | | | |
| `GET` | `/api/insights` | **JWT** | Fetches the latest AI-generated insights for a conversation. <br> **Query Params:** `?targetUserId=...` |
| `POST` | `/api/insights/generate` | **JWT** | Forces a new analysis of a conversation and saves the result. <br> **Query Params:** `?targetUserId=...` |

### WebSocket Gateway

The gateway handles real-time events for live chat and user presence.

#### Client-to-Server Events
* `registerUser (userId: number)`: Emitted by the client after login. This maps the client's `socket.id` to their `userId` on the server, marking them as "online".

#### Server-to-Client Events
* `newMessage (message: Message)`: Emitted to both the sender and receiver when a new message is successfully saved. The payload is the full `Message` object.
* `userOnline (userId: number)`: Emitted to all connected clients when a user's status changes to "online".
* `userOffline (userId: number)`: Emitted to all connected clients when a user disconnects.

---

## 💡 AI Integration: The "Smart Communication Hub"

This section details the "AI-powered insights panel," a core feature of the mission.

### Where AI is Used

The AI feature is located in the **"AI Conversation Insights"** panel on the right side of the chat dashboard.

### Why AI is Used

The purpose of this panel is to provide users with immediate, high-level understanding of their conversations without having to read the entire message history. This adds significant business value by:

* **Saving Time:** A "Summary" allows a user (e.g., a manager or colleague) to quickly catch up on the context of a conversation.
* **Providing Context:** A "Sentiment" analysis (e.g., "Slightly Positive," "Neutral") helps users gauge the tone and outcome of the discussion.
* **Identifying Key Topics:** (Future enhancement) The AI could also extract key tags or topics (like "Project Deadlines," "Resource Allocation") to make conversations searchable by theme.

### Current Implementation (Mock Data)

For this project demo, the AI insights are **mocked**. The backend does not make a live call to an AI service like OpenAI.

Instead, the `InsightsController` (or a similar service) generates and returns a static JSON object containing a pre-written summary and sentiment. This was done to:

* **Focus on Architecture:** Demonstrate the complete frontend and backend architecture, including how the data would flow from the API to the React UI.
* **Ensure App Stability:** Avoid reliance on external API keys or network latency during the demo.
* **Simulate the Feature:** Show exactly how the feature would look and feel to the end-user.

In a production environment, the `POST /api/insights/generate` endpoint would be triggered, sending the full conversation text to the OpenAI (or similar) API and then saving the response in our `Insight` database table.
