# Agentic Social AI

A lightweight web application that demonstrates an agentic AI experience for enhancing user experience and building social media content.

## Features

- AI-driven social post suggestions
- UX improvement and engagement analysis
- Simple content feed builder
- Server-side agent module with OpenAI support fallback

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root (optional):

   ```text
   OPENAI_API_KEY=your_api_key_here
   ```

3. Run the app:

   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser.

## How it works

- `server.js` hosts a static frontend and API endpoints.
- `agent.js` exposes agentic tasks for idea generation and UX guidance.
- `public/app.js` handles interactions and displays AI-driven output.

## Notes

- Without `OPENAI_API_KEY`, the app uses fallback mock responses so it still works locally.
