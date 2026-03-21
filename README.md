# 🤖 AI-Powered Code Reviewer

A full-stack MERN application that uses **Google Gemini AI** to review code and give instant feedback on bugs, complexity, and improvements.

---

## 📁 Folder Structure

```
ai-code-reviewer/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Login, register, profile
│   │   ├── reviewController.js    # AI review logic (Gemini)
│   │   └── historyController.js   # CRUD for saved reviews
│   ├── middleware/
│   │   └── auth.js                # JWT protect middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Review.js              # Review schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── review.js
│   │   └── history.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   └── Navbar.jsx
│   │   │   └── Review/
│   │   │       ├── ReviewPanel.jsx  # Main results display
│   │   │       ├── IssueCard.jsx    # Per-issue component
│   │   │       └── ScoreRing.jsx    # SVG score circle
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Editor.jsx         # Monaco editor + review
│   │   │   ├── History.jsx        # Past reviews list
│   │   │   └── ReviewDetail.jsx   # Single review view
│   │   ├── utils/
│   │   │   └── api.js             # Axios instance + interceptors
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Set up environment variables

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ai-code-reviewer
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Get your Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a new API key (free tier available)
3. Paste it in `backend/.env`

### 4. Run the project

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

App runs at: **http://localhost:5173**

---

## ✨ Features

| Feature | Details |
|--------|---------|
| 🔐 Auth | JWT-based login/register |
| 🧠 AI Review | Google Gemini 1.5 Flash |
| 📝 Monaco Editor | VS Code-style editor with syntax highlighting |
| 📊 Code Score | 0–100 quality score with visual ring |
| 🐛 Issue Detection | Bugs, warnings, suggestions with line numbers |
| ⏱️ Complexity | Big O time & space analysis |
| 💡 Improvements | Actionable suggestions |
| ✅ Good Practices | Highlights what's done right |
| 🗂️ History | Paginated review history |
| 🔍 Detail View | Full review with original code |
| 🗑️ Delete | Remove reviews from history |

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, React Router, Monaco Editor, Axios, React Hot Toast, Lucide Icons

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Google Generative AI

---

## 🌐 Deployment

- **Frontend** → [Vercel](https://vercel.com) (set `VITE_API_URL` env var)
- **Backend** → [Render](https://render.com) or [Railway](https://railway.app)
- **Database** → [MongoDB Atlas](https://cloud.mongodb.com) (free tier)
