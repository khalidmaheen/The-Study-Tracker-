# Here are your Instructions


---

## 🚀 Deployment Guide

### 📁 Backend Setup (Render or Railway)
1. Navigate to the `backend` folder.
2. Create a `.env` file using `.env.example` and add your MongoDB URI and DB name.
3. Deploy on [Render](https://render.com) or [Railway](https://railway.app) with:
   - Start command: `uvicorn server:app --host=0.0.0.0 --port=10000`
   - Python 3.11+

### 📁 Frontend Setup (Vercel)
1. Deploy the `frontend` folder to [Vercel](https://vercel.com).
2. Set env var: `NEXT_PUBLIC_API_URL=https://<your-backend-domain>/api`
3. Build Command: `yarn build`
4. Output Directory: `out`
