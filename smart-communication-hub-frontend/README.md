# Frontend: Smart Communication Hub

This is the Next.js frontend application for the V.Connct Smart Communication Hub. It provides the full user interface, including registration, login, the chat dashboard, and the AI insights panel.

---

## 🎨 Tech Stack

This project is built with the Next.js 16 App Router.

* **Framework:** Next.js (v16)
* **Language:** TypeScript
* **UI:** React (v19)
* **Styling:** Tailwind CSS (v4)
* **Data Fetching:** Axios
* **Real-time:** Socket.io-client
* **Icons:** Lucide React
* **State Management:** React Context API

---

## ⚙️ Setup and Installation

1.  **Navigate to the frontend folder**
    ```bash
    cd smart-communication-hub-frontend
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```

---

## 💡 Environment Variables

You must create a `.env.local` file in this directory to tell the frontend where to find the backend API.

1.  Create the file:
    ```bash
    touch .env.local
    ```
2.  Add the following variables. (These assume your backend is on port `3001`).
    ```env
    # .env.local
    NEXT_PUBLIC_API_URL="http://localhost:3001"
    NEXT_PUBLIC_WS_URL="http://localhost:3001"
    ```
*Note: `NEXT_PUBLIC_` is required for Next.js to expose the variable to the browser.*

---

## ▶️ Running the Application

Make sure the [backend server is running](#) first.

```bash
# Development mode (with hot-reloading)
npm run dev
