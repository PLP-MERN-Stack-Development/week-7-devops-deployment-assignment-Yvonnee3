[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19957706&assignment_repo_type=AssignmentRepo)
# Deployment and DevOps for MERN Applications

# MERN Task Manager – Week 7: Deployment and DevOps Essentials 🚀

## Overview

This project is a full-stack MERN (MongoDB, Express, React, Node.js) Task Manager application, deployed to production with CI/CD pipelines, environment configuration, and monitoring.

---


## Features

- User authentication (register/login)
- Add, complete, and delete tasks
- Filter tasks (All, Active, Completed)
- Responsive, modern UI with Tailwind CSS 4.1
- Persistent tasks (localStorage or MongoDB)
- Health check endpoint (`/api/health`)
- Production-ready backend (secure headers, logging, error handling)
- CI/CD with GitHub Actions
- Monitoring and error tracking

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS 4.1
- **Backend:** Node.js, Express, MongoDB (Atlas)
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel (frontend), Render/Railway/Heroku (backend)
- **Monitoring:** Sentry, health checks

---

## 🚀 Deployment

### 1. Backend

- Deployed to:
- Environment variables set via dashboard or `.env`:
  ```
  MONGODB_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_jwt_secret
  ```
- Continuous deployment from GitHub enabled

### 2. Frontend

- Deployed to:
- Environment variable in `.env`:
  ```
  VITE_API_URL=https://your-backend-url/api
  ```
- Continuous deployment from GitHub enabled

---

## ⚙️ CI/CD

- **Lint, test, and build** on every push (see `.github/workflows/`)
- **Auto-deploy** to production on main branch
- **Rollback**: Redeploy previous commit from hosting dashboard if needed

---

## 🩺 Monitoring & Maintenance

- **Health check:** `/api/health` returns uptime and status
- **Error tracking:** Sentry integration (see `monitoring/sentry.example.js`)
- **Uptime monitoring:** [UptimeRobot](https://uptimerobot.com/) or similar
- **Performance:** Logging with `morgan`, resource monitoring on host
- **Backups:** MongoDB Atlas automated backups

---

## 🖥️ Local Development

1. **Clone the repo:**
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Backend:**
   ```sh
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend:**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables:**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` folders and fill in your values.

---



## 📄 Maintenance Plan

- Regularly update dependencies (`npm update`)
- Monitor uptime and errors (Sentry, health checks)
- Schedule MongoDB backups
- Document deployment and rollback steps

---


## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/) 
