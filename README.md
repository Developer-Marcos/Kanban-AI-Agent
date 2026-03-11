# Kortex AI - A Kanban agent 
**Kortex AI** is an *intelligent task management system* **(ReAct Agent)** that combines the visual clarity of a Kanban board with the *processing power of an **LLM-based AI Agent***. Unlike a typical to-do list, Kortex AI understands natural language, manages time contexts, and automatically organizes tags to optimize workflow.

---

## Main features:
-  **Autonomous AI Agent**: Manipulating data using *CRUD architecture* through **natural language** instead of filling out forms. <p></p>
-  **Intelligent Context Management**: AI interprets relative deadlines *(e.g., "for tomorrow," "next Friday")* and automatically categorizes tasks with tags. <p></p>
-  **Dynamic Kanban Board**: Modern *React* interface with drag-and-drop support for moving tasks between columns. <p></p>
-  **Session Isolation**: *JWT authentication system* that ensures each user has their own frame and chat history. <p></p>
-  **Monorepo Architecture**: A clear organization that separates the *Frontend (Vite/React)* from the *Backend (FastAPI/Python)*.

---

## Technologies Used:
### Frontend Stack:
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

### Backend Stack:
  #### API & Persistence
  ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
  ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

  #### AI & Orchestration
  ![Google Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)
  ![LangChain](https://img.shields.io/badge/-LangChain-000000?style=for-the-badge&logo=langchain&logoColor=white)
  ![LangGraph](https://img.shields.io/badge/-LangGraph-000000?style=for-the-badge&logo=langchain&logoColor=white)
  ![LangSmith](https://img.shields.io/badge/-LangSmith-000000?style=for-the-badge&logo=langchain&logoColor=white)
  
### Infrastructure & Deploy
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)

---

## System Architecture:
The **Kortex AI System architecture** operates on a *microservices framework* where the **AI ​​Agent** acts as a bridge between the user and the database. When a command is sent in the chat:
1. The backend receives the message and *validates* the user's session.
2. *LLM (Gemini)* processes user intent.
3. If necessary, the *AI* ​​triggers *customized Tools* that interact with the task *API*.
4. The result is *persisted in **PostgreSQL*** and *instantly reflected in the React Frontend*.

---

## How to use:
This project uses **Docker Compose to orchestrate** all services *automatically*.

  ### Prerequisites:
  -  Docker and Docker Compose installed.
  -  A Google AI (Gemini) API key.
  -  Langsmith API key (Optional).

  ### Step by step:
  1. <p>Clone the repository:</p>
  ```bash
       git clone https://github.com/Developer-Marcos/Kanban-AI-Agent.git
  ```
  2. <p>Enter the repository's root folder:</p>
  ```bash
      cd Kanban-AI-Agent
  ```
  3. <p>Setup your environment:</p>
  ###### Create a .env file in the project root (use .env.example as a base).
  ```bash
      cp .env.example .env
  ```
  4. <p>Fire up the containers:</p>
  ```bash
      docker compose up --build
  ```

---

### Local Access
Once the containers are running, you can access the application at:

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
       
