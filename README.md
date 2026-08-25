# ⚡ CivicPulse AI (AI Problem Analyzer)

An intelligent public grievance analytics platform powered by **Google Gemini Vision AI** and **Node.js / Express / MongoDB / React**. Built to extract, transcribe, categorize, and visualize handwritten and typed citizen complaints from scanned PDF documents into actionable ward-wise governance records.

---

## 🚀 Key Capabilities

- 📝 **Multilingual Handwritten OCR**: Extracts handwritten letters in Hindi (Devanagari) and English using Gemini Vision (`gemini-2.5-flash`).
- 📍 **Ward-Wise Geographic Aggregation**: Automatically groups citizen complaints by administrative Ward number (Wards 1 through 5).
- 🏷️ **Autonomous Problem Tagging**: Categorizes grievances into civic sectors (Drinking Water, Electricity, Roads, Sanitation, Handpumps, etc.).
- 🇮🇳 **Side-by-Side Dual Language Verification**: Displays original Hindi citizen petitions alongside concise English AI summaries.
- 📊 **Visual Analytics Dashboard**: Interactive Chart.js bar charts for petition frequency and drill-down pie charts for problem categories.
- 🔄 **Real-Time Job Queue & Socket.IO**: Asynchronous PDF page processing via BullMQ workers with live UI status notifications.
- 👥 **Officer Team Management**: Role-based access control with secure HTTP-only sessions.

---

## 🛠 Tech Stack

### Frontend

- **React (Vite)** + TypeScript
- **Tailwind CSS** (Monochrome & Paper Design System)
- **Ant Design (v5)**
- **Chart.js & react-chartjs-2**
- **Socket.IO Client & Axios**

### Backend

- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **Google Generative AI SDK (Gemini Vision)**
- **BullMQ & Redis** (Background worker queue)
- **pdftoppm (`pdf-poppler`)** (PDF page-to-image extraction)
- **Socket.IO** (Real-time events)
- **express-session & connect-mongo**

---

## 📁 Project Architecture

```
AI-Problem-Analyzer/
├── backend/
│   ├── config/
│   │   ├── bullmq.js         # BullMQ queue & worker configuration
│   │   ├── generation.js     # pdftoppm conversion & Gemini Vision prompt
│   │   └── socket.js         # Socket.IO initialization
│   ├── controllers/          # Express route controllers (requests, reports, users)
│   ├── models/               # Mongoose schemas (request, report, user)
│   ├── router/               # API route definitions
│   ├── example.json          # 20 pre-seeded village complaint records
│   ├── migrate.js            # Initial database migration script
│   └── index.js              # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components (charts, tables, ward breakdowns)
│   │   ├── pages/            # Page views (Home, Dashboard, Reports, Analytics, Auth)
│   │   └── router.tsx        # Application routing
│   ├── index.css             # Tailwind & theme styling
│   └── vite.config.ts        # Vite build configuration
├── docker-compose.yml        # Multi-container Docker orchestration
└── README.md                 # Project documentation
```

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/iamsumitkumar64/AI-Problem-Analyzer.git
cd AI-Problem-Analyzer
```

### 2. Configure Environment Variables

Create `.env` in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

```env
PORT=8080
SESSION_SECRET=your_super_secret_session_key
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:5173
MONGODB_URL=mongodb://mongodb:27017
MONGODB_NAME=ai_problem_analyzer
REDIS_HOST=redis
REDIS_PORT=6379
GEMINI_API=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
VITE_BACKEND_URL=http://localhost:8080
```

> **Note**: When running locally without Docker, change `MONGODB_URL` to `mongodb://localhost:27017` and `REDIS_HOST` to `localhost`.

---

## 🐳 Starting the Project with Docker

The project provides complete multi-container Docker support with MongoDB, Redis, Node.js (`poppler-utils` enabled for PDF conversion), and React Vite.

### Option 1: Standard Docker Run (Recommended)

Build and spin up all 4 containers (MongoDB, Redis, Backend with BullMQ worker, Frontend):

```bash
docker-compose up --build
```

Seed the database with sample village grievance records inside the running backend container:

```bash
docker exec -it ai_backend node migrate.js
```

- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080](http://localhost:8080)

---

### Option 2: Development Mode with Live Hot-Reloading

Mounts local directories into the containers so code edits update instantly:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

---

### Option 3: Production Mode with Nginx

Builds optimized production assets and serves the frontend through Nginx on port 80:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

- **Production Frontend**: [http://localhost](http://localhost) (Port 80)
- **Production Backend**: [http://localhost:8080](http://localhost:8080)

---

### Useful Docker Management Commands

| Action                                     | Command                                        |
| :----------------------------------------- | :--------------------------------------------- |
| **View Live Container Logs**         | `docker-compose logs -f`                     |
| **View Specific Service Logs**       | `docker-compose logs -f backend`             |
| **Check Container Status**           | `docker-compose ps`                          |
| **Run Database Migration**           | `docker exec -it ai_backend node migrate.js` |
| **Stop All Containers**              | `docker-compose down`                        |
| **Stop & Wipe Volumes (Reset Data)** | `docker-compose down -v`                     |

---

## 💻 Or Run Locally (Without Docker)

If you prefer running without Docker, ensure you have **MongoDB**, **Redis**, and **poppler-utils** (`pdftoppm`) installed on your system.

### Step A: Start Backend & Worker

```bash
cd backend
npm install
node migrate.js    # Seed sample database entries
npm run dev        # Starts Express server & BullMQ worker
```

### Step B: Start Frontend

```bash
cd frontend
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

---

## 🔄 How the Processing Pipeline Operates

1. **Ingest PDF**: An administrative officer uploads a scanned PDF containing citizen grievance letters.
2. **Page Conversion**: The backend worker executes `pdftoppm` to extract each PDF page into a 300 DPI PNG image.
3. **Gemini Vision Extraction**: Each page image is sent to Gemini Vision with a structured schema to extract:
   - Citizen Name (English & Hindi)
   - Mobile Number (if available)
   - Ward Number (Wards 1–5)
   - Problem Statement (English summary & Original Hindi)
   - Topic Tags (`#Drinking Water`, `#Electricity`, `#Roads`, etc.)
4. **Data Aggregation**: Results are stored in MongoDB and broadcasted live to connected clients via Socket.IO.
5. **Dashboard Analysis**: Officers inspect ward-wise distributions, filter by topic, and examine bilingual records.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 👨‍💻 Author

**Sumit Birwal**
GitHub: [@iamsumitkumar64](https://github.com/iamsumitkumar64)
