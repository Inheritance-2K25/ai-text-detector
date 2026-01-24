## 🚀 Steps to Run the Project (Local)

### 1️⃣ Clone the repository

```bash
git clone <repository-url>
```

---

## 🧠 Run Backend (FastAPI)

### 2️⃣ Go to backend directory

```bash
cd backend
```

---

### 3️⃣ Create & activate virtual environment

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 4️⃣ Install backend dependencies

```bash
pip install -r requirements.txt
```

---

### 5️⃣ Start backend server

```bash
uvicorn app:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

## 🌐 Run Frontend (Next.js)

### 6️⃣ Open new terminal & go to project root

```bash
cd ai-text-detector
```

---

### 7️⃣ Install frontend dependencies

```bash
npm install
```

---

### 8️⃣ Start frontend server

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔄 Run Summary

| Service  | Command                    | Port |
| -------- | -------------------------- | ---- |
| Backend  | `uvicorn app:app --reload` | 8000 |
| Frontend | `npm run dev`              | 3000 |

---
