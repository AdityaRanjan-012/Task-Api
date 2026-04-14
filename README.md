<div align="center">
  <img src="https://socialify.git.ci/AdityaRanjan-012/Task-Api/image?description=1&font=Inter&name=1&owner=1&pattern=Circuit%20Board&theme=Dark" alt="Task-Api" width="600" />

  <br />
  <br />

  <strong>TaskVault ✨ Premium Task Manager API & Frontend</strong>

  <br />
  
  <a href="https://task-api-plum.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-task--api--plum.vercel.app-b45fff?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <br />

  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node" />
  </a>
  <a href="https://expressjs.com">
    <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  </a>
  <a href="https://jestjs.io/">
    <img src="https://img.shields.io/badge/Jest-Tested-C21325?style=flat-square&logo=jest&logoColor=white" alt="Jest" />
  </a>
</div>

<hr />

## 🚀 Overview

**TaskVault** is a full-stack, take-home assignment demonstrating a robust REST API interacting securely with a beautifully designed, premium Vanilla JS frontend. 

Built entirely in Node.js & Express, it boasts 90%+ Test Coverage, robust validation layers, and glassmorphic UI aesthetics.

## ✨ Features

- **Premium UI:** A purely Vanilla JS/CSS frontend built with glassmorphism, dynamic animations, and zero heavy framework overhead.
- **Robust REST API:** Full CRUD mechanics designed intelligently utilizing semantic HTTP codes. 
- **Assignments:** Delegate tasks directly to specific users via the `/assign` integration.
- **Tested & Bulletproof:** Backed by Supertest and Jest, achieving >90% coverage mimicking real-world production expectations.
- **Bug Fixed:** Handled deeply layered bugs involving offset pagination, reference mutations, and strict string equality indexing. 

---

## 🌎 Live Deployment

The entire monolithic architecture is hosted on **Vercel**. 

👉 **[Try the Application Live!](https://task-api-plum.vercel.app)**

> *Note: By nature of Vercel’s serverless Node design, the in-memory array (`let tasks = []`) will clear automatically after a period of container idleness.*

---

## 📖 API Documentation

| Method | Endpoint                    | Description                                      | Requires Body |
| ------ | --------------------------- | ------------------------------------------------ | ------------- |
| `GET`  | `/tasks`                    | Retrieve all tasks (Supports `?page=` & `?limit=`)| No            |
| `GET`  | `/tasks/stats`              | Retrieve cumulative status analytics.            | No            |
| `POST` | `/tasks`                    | Create a new task.                               | Yes           |
| `PUT`  | `/tasks/:id`                | Overwrite/Update a task.                         | Yes           |
| `PATCH`| `/tasks/:id/assign`         | Assign a task to a user (`{ assignee: "..." }`)  | Yes           |
| `PATCH`| `/tasks/:id/complete`       | Set a task to `done`.                            | No            |
| `DELETE`| `/tasks/:id`               | Delete a specific task.                          | No            |

---

## 🛠️ Local Installation

**1. Clone the repository**
```bash
git clone https://github.com/AdityaRanjan-012/Task-Api.git
cd Task-Api
```

**2. Install Dependencies**
```bash
npm install
```

**3. Run the Development Server**
```bash
npm start
```
*The server will boot locally on `http://localhost:3000`.*

---

## 🧪 Testing

This project emphasizes test-driven environments. To execute the automated testing loops:

```bash
# Run unit & integration tests
npm run test

# Run tests and generate coverage report (Lcov/Istanbul)
npm run coverage
```

---

<div align="center">
  <p>Built as a Take-Home Assignment Showcase.</p>
</div>
