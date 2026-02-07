# AI Prompts Used in Development

This document contains all AI prompts used during the development of this project.

## Project Setup

**Prompt 1: Initial Project Structure**
```
I want to create a job interview simulator using Cloudflare Workers AI. 
The app should have:
- Frontend in React/TypeScript
- Backend using Cloudflare Workers
- AI-powered interview conversations
- Session storage with Durable Objects

Can you help me set up the initial project structure?
```

**Prompt 2: Backend Architecture**
```
How should I structure the Cloudflare Worker backend? I need:
- REST API endpoints
- Integration with Workers AI (Llama model)
- Durable Objects for session persistence
- Proper TypeScript types
```

## Backend Development


**Prompt 3: AI Integration**
```
How do I integrate Cloudflare Workers AI (Llama 3.3 70B) in my Worker?
I need to:
- Send conversation history as context
- Use system prompts for interviewer role
- Extract clean text from AI response
- Handle different response formats (string vs object)
```

**Prompt 4: System Prompts**
```
Create a professional system prompt for an AI job interviewer that:
- Introduces itself warmly
- Asks relevant questions based on job area
- Adapts to candidate responses
- Provides helpful follow-ups
- Maintains professional tone
```

**Prompt 5: Feedback Generation**
```
Create a system prompt for generating interview feedback that analyzes:
- Communication skills
- Technical knowledge
- Problem-solving approach
- Specific examples shared
- Areas for improvement

Return structured JSON with score, strengths, improvements, summary, and recommendation.
```

## Frontend Development

**Prompt 6: React App Structure**
```
Help me structure a React app with TypeScript for the interview simulator:
- SessionStart component (form)
- ChatInterface component (conversation)
- FeedbackPanel component (results)
- App.tsx (state management)
Include proper TypeScript interfaces.
```

**Prompt 7: shadcn/ui Setup**
```
How do I set up shadcn/ui in my React + Vite project?
I need these components:
- Button, Input, Card
- Select, Badge, Avatar
- ScrollArea, Textarea, Separator
```

**Prompt 8: Chat Interface Component**
```
Create a ChatInterface component that:
- Displays message bubbles (user vs AI)
- Auto-scrolls to bottom on new messages
- Shows "AI is typing..." indicator
- Handles Enter to send (Shift+Enter for new line)
- Includes header with job area badge and "End Interview" button
```

**Prompt 9: Custom useChat Hook**
```
Create a custom React hook useChat that:
- Loads message history on mount
- Sends messages to API
- Handles optimistic updates
- Auto-scrolls to bottom
- Manages loading and error states
```

**Prompt 10: Session History Feature**
```
Add session history feature:
- Store last 10 sessions in localStorage
- SessionList component showing past interviews
- Option to resume or delete sessions
- "View Previous Sessions" button on start screen
```

**Prompt 11: Feedback Display**
```
Create a FeedbackPanel component that:
- Handles both JSON object and plain text feedback
- Renders structured feedback in a fancy way (score, strengths, improvements)
- Falls back to plain text if JSON parsing fails
- Shows loading state while generating
- Includes "New Interview" button
```

## Debugging & Fixes

**Prompt 12: Durable Objects Migration Error**
```
I'm getting the following error: "must create namespace using new_sqlite_classes migration"
How do I fix this? The worker already exists with old migration.
```

**Prompt 13: React Children Error**
```
Error: "Objects are not valid as a React child (found: object with keys...)"
The AI feedback is returning a JSON object but React tries to render it.
```

## UI/UX Improvements

**Prompt 14: Navigation Flow**
```
Add navigation features:
- "Back" button in chat to start new interview
- "View Previous Sessions" on home screen
- Session list with resume/delete options
- Confirmation before clearing all sessions
```

**Prompt 15: Message Bubble Styling**
```
Style chat messages with:
- Different colors for user vs AI
- Avatar icons (User icon vs Bot icon)
- Timestamp on each message
- Rounded bubbles with appropriate alignment
- Max width 70% for readability
```

**Prompt 16: Loading States**
```
Improve UX with loading states:
- Spinner while starting session
- "AI is typing..." in chat
- Skeleton while generating feedback
- Disabled inputs during API calls
```
---