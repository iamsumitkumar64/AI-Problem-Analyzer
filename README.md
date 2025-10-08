# 🧠 AI-Problem-Analyzer

A **MERN-based analytics platform** integrated with **Gemini AI**, built to extract and visualize data from handwritten PDF documents. Designed for administrative problem tracking using intelligent data parsing, bulk processing, and clean visual dashboards.

---

## 🚀 Features

- 🔐 JWT-based user authentication
- 📄 Upload handwritten complaint PDFs
- 🤖 Gemini AI-powered data extraction
- 📊 Chart.js-based dynamic visualizations
- 🗂 Ward-wise & common issue breakdown
- ⚡ Responsive UI using Tailwind CSS + Ant Design
- 🔄 Real-time updates & modular data handling

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Ant Design
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Gemini AI API Integration

---

## 📁 Folder Structure

```
AI-Problem-Analyzer/
├── frontend/             # Vite + React frontend
│   └── .env              # Frontend environment variables
├── backend/              # Express backend with MongoDB
│   └── .env              # Backend environment variables
├── Problem_Requests_1.pdf
├── Problem_Requests_2.pdf
└── README.md
```

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/iamsumitkumar64/AI-Problem-Analyzer.git
cd AI-Problem-Analyzer
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm i
```

#### Frontend

```bash
cd ../frontend
npm i
```

---

## ⚙️ Environment Variables Setup

### 📁 Backend: `backend/.env`

```env
PORT=5000
SESSION_SECRET=super_secret_key_123
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
MONGODB_URL=mongodb://localhost:27017
MONGODB_NAME=ai_problem_analyzer
GEMINI_API=your_gemini_api_key_here
```

### 📁 Frontend: `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

> ⚠️ Don’t forget to restart the frontend after editing `.env`.

---

## ▶️ Running the App

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🌐 Local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 📌 Use Cases

- Government complaint handling
- Automated issue categorization
- Visualization of local civic problems by ward
- AI-enhanced PDF data extraction

---

## 🧠 AI Integration

Uses **Gemini AI API** to extract structured data from uploaded handwritten complaint PDFs.  
Automatically parses ward information and issues, converts them into modular entries, and feeds them into Chart.js dashboards for visual analysis.

---

## ✅ Future Enhancements

- [ ] Admin dashboard for managing users
- [ ] Real-time alerts with Socket.io
- [ ] Export data as reports (PDF/CSV)
- [ ] Enhanced AI model fallback/validation

---

## 🤝 Contributing

Pull requests and contributions are welcome!  
Feel free to fork this repo, make changes, and open a PR.

---

## 👨‍💻 Author

**Sumit Birwal**  
GitHub: [@iamsumitkumar64](https://github.com/iamsumitkumar64)

---
