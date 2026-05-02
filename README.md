# 🚀 Full-Stack MERN Portfolio

A modern, full-stack developer portfolio built with the MERN stack — featuring an animated glassmorphism UI, AI-powered content generation, an admin dashboard, and seamless deployment on Vercel + Render.

## 🌐 Live Demo

- **Frontend:** [Vercel URL](https://your-portfolio.vercel.app)
- **Backend API:** [Render URL](https://your-portfolio-api.onrender.com)

---

## ✨ Features

- 🎨 **Premium UI** — glassmorphism, gradient backgrounds, Framer Motion animations
- 🤖 **AI Generation** — Google Gemini AI for content suggestions
- 🛡️ **Admin Dashboard** — full CRUD for projects, blog, skills, testimonials
- 📱 **Fully Responsive** — mobile-first design with slide-in sidebar
- 📧 **Contact Form** — email notifications via Nodemailer
- 🌙 **Dark / Light Mode**
- 📊 **Analytics** — page view tracking
- ☁️ **Image Upload** — Cloudinary integration

---

## 🏗️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Backend   | Node.js, Express, MongoDB (Mongoose)    |
| Auth      | JWT, bcryptjs                           |
| AI        | Google Gemini API                       |
| Storage   | Cloudinary                              |
| Email     | Nodemailer                              |
| Deploy    | Vercel (frontend) + Render (backend)    |

---

## 📁 Project Structure

```
portfolio/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── store/       # Zustand state
│   │   ├── hooks/       # Custom hooks
│   │   └── utils/       # API helpers
│   └── vercel.json
│
└── backend/           # Express API
    ├── controllers/   # Route handlers
    ├── models/        # Mongoose schemas
    ├── routes/        # API routes
    ├── middleware/    # Auth, error handling
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Fill in your environment variables in .env
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL in .env
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GEMINI_API_KEY=...
EMAIL_USER=...
EMAIL_PASS=...
ADMIN_EMAIL=...
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌍 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Set `VITE_API_URL` environment variable → your Render backend URL
4. Deploy

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set **Root Directory** to `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add all environment variables from `.env`
6. Deploy

---

## 👤 Admin Access

After seeding, login at `/login` with admin credentials.

To seed the database:

```bash
cd backend
node seed.js
```

---

## 📝 License

MIT © Your Name
