# UniMart Backend – Developer Quickstart

This guide helps **frontend engineers** and other developers quickly start, run, and test the UniMart backend API (in development mode), including how to access the Swagger docs for API testing.

---

## Prerequisites

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **MongoDB Atlas** connection string (already configured in `.env`)
- **Git** (optional, for cloning the repo)

---

## 1. Clone the Repository

```sh
git clone <repo-url>
cd backend-api
```

---

## 2. Install Dependencies

```sh
npm install
```

---

## 3. Environment Variables

Check that your `.env` file exists in the project root and contains:

```
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
PORT=5000
```

---

## 4. Run the Server (Development)

```sh
npm run dev
```
or (if you want to run the compiled JS)
```sh
npm run build
npm start
```

- The server will start on `http://localhost:5000` (or the port set in `.env`).

---

## 5. Access Swagger API Docs

Open your browser and go to:

```
http://localhost:5000/api-docs
```

- This page provides **interactive API documentation**.
- You can test endpoints like `api/auth/register` and `api/auth/login` directly from the browser.

---

## 6. Example: Register & Login

- **Register:**  
  `POST api/auth/register`  
  Body:
  ```json
  {
    "email": "test@example.com",
    "password": "Password1!",
    "role": "customer"
  }
  ```

- **Login:**  
  `POST api/auth/login`  
  Body:
  ```json
  {
    "email": "test@example.com",
    "password": "Password1!"
  }
  ```

---

## 7. Troubleshooting

- If you see `Cannot GET /api-docs`, make sure the server is running and you are on the correct port.
- If you get MongoDB connection errors, check your `.env` and Atlas IP whitelist.

---

## 8. Useful Scripts

- `npm run dev` – Start server with live reload (TypeScript, development)
- `npm run build` – Compile TypeScript to JavaScript
- `npm start` – Start server from compiled JS (`dist/server.js`)
- `npm test` – Run backend tests

---

## 9. Need Help?

Contact the backend team or check the project Slack/Discord for