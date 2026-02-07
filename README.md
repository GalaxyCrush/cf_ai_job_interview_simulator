# cf_ai_job_interview_simulator

An AI-powered interview practice platform built with Cloudflare Workers AI, Durable Objects, and React.

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)

## Overview

This application allows users to practice job interviews with an AI interviewer. The AI conducts realistic interviews tailored to specific job areas, provides real-time conversation, and generates detailed feedback at the end of the session.

**Live Demo:** [https://job-interview-sim.joaomrpereira0.workers.dev/](https://job-interview-sim.joaomrpereira0.workers.dev/)

## Features

- **AI-Powered Interviews**: Realistic interview conversations using Cloudflare Workers AI (Llama 3.3 70B)
- **Persistent Sessions**: Interview history stored using Durable Objects
- **Detailed Feedback**: Comprehensive performance analysis with strengths and improvements
- **Privacy-First**: All data stays in Cloudflare's edge network


## Architecture

### Tech Stack

**Frontend:**
- React + TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn/ui components
- Axios (API client)

**Backend:**
- Cloudflare Workers (serverless runtime)
- Hono (web framework)
- Workers AI (LLM inference)
- Durable Objects (stateful storage)


## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier works)
- `wrangler` CLI installed globally

### Installation

```bash
# Clone the repository
git clone https://github.com/GalaxyCrush/cf_ai_job_interview_simulator.git
cd cf_ai_job_interview_simulator/job-interview-sim

# Install dependencies
npm install

# Login to Cloudflare (if not already)
npx wrangler login
```

### Development

Run frontend and backend separately for hot-reload:

```bash
# Terminal 1: Start backend (Worker)
npx wrangler dev

# Terminal 2: Start frontend (React)
npm run dev
```

Then open http://localhost:5173

### Production Build & Deploy

```bash
# Build frontend
npm run build

# Deploy to Cloudflare
npm run deploy
```

Your app will be live at: `https://job-interview-simulator.<your-subdomain>.workers.dev`

## Usage

### 1. Start an Interview

1. Enter your name
2. Select your job area (Frontend, Backend, etc.)
3. Click "Start Interview"

### 2. Chat with AI

The AI will ask you interview questions. Answer naturally - the AI adapts to your responses.

### 3. Get Feedback

Click "End Interview" to receive detailed feedback on:
- Overall performance score
- Strengths identified
- Areas to improve
- Specific recommendations

### 4. Review History

Click "View Previous Sessions" to resume past interviews or review feedback.

### Customization

**Change AI Model:**

Edit `src/worker/constants.ts`:
```typescript
export const AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
```

**Customize Interview Prompts:**

Edit system prompts in `src/worker/constants.ts`:
```typescript
export const SYSTEM_PROMPTS = {
  interviewer: "You are a professional HR interviewer...",
};
```