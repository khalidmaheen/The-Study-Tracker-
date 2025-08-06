# Study Tracker

A smart and responsive web application to manage your study sessions efficiently.

## 🚀 Deployment Guide

### 📁 Backend (Render or Railway)
1. Open the `backend` folder.
2. Duplicate `.env.example` to `.env` and update it with your MongoDB credentials.
3. Deploy using:
   ```
   uvicorn server:app --host=0.0.0.0 --port=10000
   ```
4. Ensure your environment is running Python 3.11 or later.

### 📁 Frontend (Vercel)
1. Deploy the `frontend` folder to [Vercel](https://vercel.com).
2. Add the following environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://<your-backend-domain>/api
   ```
3. Build Command: `yarn build`
4. Output Directory: `out`

---

For any issues or contributions, feel free to fork the repo and improve it further.
