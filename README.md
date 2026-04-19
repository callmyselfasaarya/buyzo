# Buyzo - AI-Powered Shopping Assistant

Buyzo is a modern e-commerce companion that uses AI to help users find the perfect products through a conversational interface. By analyzing user intent, budget, and preferences, Buyzo provides personalized recommendations in real-time.

## 🚀 Existing Features

- **AI Shopping Assistant**: An interactive chat interface powered by **Gemini 1.5 Flash** that understands natural language shopping queries.
- **Smart Intent Extraction**: Automatically extracts product categories, target budgets, specific brands, and feature keywords (e.g., "camera", "gaming") from user messages.
- **Instant Product Recommendations**: Real-time filtering and suggestions based on the conversation context.
- **Modern & Responsive UI**: A premium user interface built with **React**, **Tailwind CSS**, and **Framer Motion** for smooth animations and transitions.
- **Structured Filtering**: Logic-based product filtering on the backend ensuring accurate results for category and budget constraints.
- **Glassmorphism Design**: Sleek, modern aesthetic with glassmorphism cards and vibrant gradients.
- **Scalable Architecture**: A clean separation of concerns with a **FastAPI** backend and a **Vite**-powered frontend.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query (React Query)

### Backend
- **Framework**: FastAPI
- **AI Engine**: Google Gemini 1.5 Flash
- **Language**: Python 3.10+
- **Validation**: Pydantic
- **Server**: Uvicorn

## 📂 Project Structure

```text
buyzo/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/# Reusable UI components
│   │   ├── pages/     # Page views (Index, Chat)
│   │   └── services/  # API service layers
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py    # Main API entry point
│   │   ├── services/  # AI and business logic
│   │   ├── models/    # Data schemas
│   │   └── data/      # Mock product database
```

## ⚙️ Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Set your `GEMINI_API_KEY` in the `.env` file.
6. Run the server: `python app/main.py`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---
Built with AI • Buyzo 2026
