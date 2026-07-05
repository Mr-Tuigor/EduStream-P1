# EduStream : AI-Powered Educational Streaming Platform

**Author**: Shaharyar Ansari  
**Affiliation**: Suryodaya College of Engineering and Technology  

## Project Overview
This project presents an AI-enhanced educational video streaming platform designed to provide a personalized, interactive, and seamless learning experience. The system integrates advanced web technologies (MERN stack) with an intelligent chatbot to assist students in their educational journey.

### IEEE Project Summary
This project follows standard academic and technical reporting structures. Below is a condensed summary of the full project report:

* **Introduction & Domain**: Situated in the domains of E-Learning, Artificial Intelligence, and Web Streaming, this project focuses on modernizing online education. While MOOCs and video platforms are popular, they suffer from passive consumption and disjointed learning workflows.
* **Literature Survey Insights**: Extensive research shows that the "split-attention effect" (switching between a video and a search engine) increases cognitive load. Current platforms lack deeply integrated, real-time pedagogical agents, leaving a gap for embedded AI tutors.
* **Problem Definition**: Traditional learning platforms often lack real-time personalized assistance. Students frequently face high latency in query resolution through forums and experience cognitive overload when context-switching to find answers while watching educational videos.
* **Objectives**: 
  - *Primary*: Develop a scalable MERN-stack video platform featuring an embedded AI chatbot for real-time, context-aware student support.
  - *Secondary*: Implement secure JWT authentication, role-based access, and robust search functionality.
* **Proposed Work & Architecture**: The system utilizes a three-tier Client-Server architecture. The frontend (React) handles UI and video playback, the backend (Node/Express) manages API requests and AI integrations, and the database (MongoDB) stores metadata and user profiles. 
* **Methodology**: Built using an Agile approach, the frontend leverages Vite and Context API for fast rendering and state management. The backend ensures secure password hashing (bcrypt) and routes chatbot queries to an external LLM to act as a 24/7 personal tutor.

## Project Setup Instructions

### Prerequisites
Make sure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
First, clone the project to your local machine:
```bash
git clone https://github.com/mr-tuigor/Edustream.git
cd Edustream
```

### 2. Backend Setup
Navigate to the backend directory and install the required dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend` directory and add your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
AI_API_KEY=your_ai_service_api_key (if applicable)
```

Start the backend server:
```bash
npm run dev
# If you don't have nodemon installed, you can use: node server.js
```
*The backend server should now be running on `http://localhost:5000`.*

### 3. Frontend Setup
Open a new terminal window/tab, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend Vite development server:
```bash
npm run dev
```
*The frontend application will be available at `http://localhost:5173`.*

## Architecture & Methodology
The project follows a modern Client-Server architecture utilizing the MERN stack:
- **Frontend**: Built with React.js and Vite for fast performance. It utilizes React Router for navigation and Context API for global state management (Authentication state, Chatbot state).
- **Backend**: Built with Node.js and Express.js, providing a RESTful API for frontend consumption.
- **Database**: MongoDB is used for persistent storage of user profiles, video metadata, search histories, and analytics.
- **AI Integration**: Custom AI routes (`/api/ai`) connect to language models to power the frontend ChatbotWidget, offering real-time conversational assistance.
