# Outflow AI

Outflow AI is an early-stage workflow orchestration platform built for AI-native automation systems.

It provides a visual interface for constructing structured execution pipelines backed by a validation engine that enforces deterministic workflow behavior. The long-term goal is to evolve Outflow AI into a scalable SaaS platform for AI agent orchestration and intelligent automation infrastructure.

The project is currently in foundational development.

---

## Vision

Modern AI systems require structured execution, not isolated prompts.

Outflow AI is being developed to support:

* AI agent workflows
* Multi-step LLM pipelines
* Tool-calling orchestration
* Structured automation graphs
* Deterministic execution engines

The objective is to combine visual workflow construction with production-grade orchestration capabilities.

---

## Current Status

Outflow AI is in its infrastructure phase.

The current version establishes core workflow architecture and graph validation mechanics. It does not yet include:

* LLM integrations
* External API connectors
* Agent execution logic
* Persistent workflow storage
* Authentication or multi-user SaaS features

This repository represents the architectural groundwork for a future AI-powered orchestration platform.

---

## Architecture

### Frontend

* React
* React Flow for visual graph rendering
* Modular node abstraction
* Graph state modeling and serialization

### Backend

* FastAPI
* Uvicorn
* Directed Acyclic Graph (DAG) validation
* Execution engine groundwork

The system separates workflow design from backend validation, preparing the platform for scalable runtime expansion.

---

## Project Structure

```
outflow_ai/
├── frontend/   # Visual workflow builder
├── backend/    # Validation and execution foundation
└── README.md
```

---

## Running Locally

### Frontend

```bash
cd frontend
npm install
npm start
```

Runs at:

```
http://localhost:3000
```

---

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
# source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Runs at:

```
http://127.0.0.1:8000
```

API docs:

```
http://127.0.0.1:8000/docs
```

---

Outflow AI is focused on building strong architectural foundations before layering AI execution capabilities on top.
