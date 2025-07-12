# 🎉 Virtual Event Management Platform (Backend)

This project is a **Node.js + Express.js** backend for managing virtual events. It supports:

- User & Organiser Registration/Login with JWT Authentication 
- `['user', 'organiser']` are the roles that are predefined
- Added a role base `register` and `login` as can been seen in many webistes
- Event Creation, Updating, Deletion (Organisers only)
- Event Registration for Attendees
- Email confirmation via **Ethereal Email (Nodemailer)**

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for Authentication
- bcrypt for Password Hashing
- express-validator for Input Validation
- Nodemailer with Ethereal Email (for development email testing)
- Userd in-memory data structure to store blaclisted JWT after successfull logout (tried to mock **Redis** which can be used for storing and blacklist JWT)

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/virtual-event-backend.git
cd virtual-event-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/eventdb
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

### 4. Start the server

```bash
npm start
```

Server runs on: `http://localhost:3001`

---

## 📬 Mail Setup (Ethereal Email)

Ethereal is used for **testing emails** in development.

- Automatically generates test email accounts
- Does not deliver real emails
- Use the preview URL logged in the terminal to see the email content

✅ No extra setup required. See the console log when registering for an event.

```bash
🔗 Preview URL: https://ethereal.email/message/YOUR-MESSAGE-ID
```

---

## 🔐 Environment Variables

| Variable         | Description                        |
| ---------------- | ---------------------------------- |
| `PORT`           | Server port (default: 3001)        |
| `MONGO_URI`      | MongoDB connection string          |
| `JWT_SECRET`     | Secret key for signing JWT         |
| `MAIL_USER`      | Ethereal Mail ID                   |
| `MAIL_PASSKEY`   | Ethereal Mail Password             |

---

## 📡 API Reference

### 🔑 Authentication

| Method | Endpoint                                        | Description                | Auth Required | Role Required           | Body Parameters                     |
| ------ | ----------------------------------------------- | -------------------------- | ------------- | ----------------------- | ----------------------------------- |
| POST   | `/event-management/api/v1/register/:role`       | Register user or organiser | ❌            | `user` or `organiser`   | `name`, `email`, `phone`,`password` |
| POST   | `/event-management/api/v1/login/:role`          | Login user or organiser    | ❌            | `user` or `organiser`   | `email`, `password`                 |
| POST   | `/event-management/api/v1/logout`               | Logout & blacklist JWT     | ✅            | ❌                      | ❌                                  |

### 🎫 Events

| Method | Endpoint                                              | Description                          | Auth Required | Role Required | Body Parameters                              |
| ------ | ----------------------------------------------------- | ------------------------------------ | ------------- | ------------- | -------------------------------------------- |
| POST   | `/event-management/api/v1/service/event`              | Create new event                     | ✅            | `organiser`   | `title`, `description`, `date`, `time`, etc. |
| GET    | `/event-management/api/v1/service/event`              | Get all events for very kind of user | ✅            | ❌           | ❌                                           |
| PUT    | `/event-management/api/v1/service/event/:id`          | Update an existing event by ID       | ✅            | `organiser`   | Partial or full event data                   |
| DELETE | `/event-management/api/v1/service/event/:id`          | Delete an event by ID                | ✅            | `organiser`   | ❌                                           |
| POST   | `/event-management/api/v1/service/event/:id/register` | Register for an event by event ID    | ✅            | `user`        | (gets user info from JWT)                    |

---

## 🔁 JWT Blacklisting (Logout)

On logout, the JWT token is **blacklisted in memory or Redis** so it can't be reused. All protected routes validate against the blacklist.

---

## 📧 Sample Email Preview (from Ethereal)

After successful registration, an email like this will be sent:

```
Subject: Registered for JavaScript Bootcamp

Hi John,

You've successfully registered for "JavaScript Bootcamp" on July 20th at 4:00 PM.

Thanks,
Event Team
```

You’ll get a preview link like:

```bash
🔗 Preview URL: https://ethereal.email/message/YOUR-MESSAGE-ID
```

### 5. Run the test

```bash
npm run test
```

---

## 📂 Project Structure

```
.
├── controllers/
│   └── userController.js, eventController.js
├── middleware/
│   └── userMiddleware.js, eventMiddleware,validation.js
├── models/
│   └── userSchema.js, eventSchema.js
├── routes/
│   └── userRoutes.js, eventRoutes.js
├── test/
│   └── serverTests.js
├── utils/
│   └── sendMail.js
├── .env
├── app.js
├── server.js
├── storeBlacklistedTokenjs
└── README.md
```

---

## 🧑‍💻 Developed By

Gobinda Deb  
📍 Guwahati, India  
Frontend Developer & Ancient History Enthusiast

---

## 📃 License

This project is for learning/demo purposes. You’re free to reuse and modify it under the MIT License.
