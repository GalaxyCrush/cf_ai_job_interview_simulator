import { Hono } from "hono";
import { cors } from "hono/cors";
import { AI_MODEL, SYSTEM_PROMPTS, FEEDBACK_PROMPT } from "./constants";
import { InterviewSession } from "./durable-objects/InterviewSession";

const app = new Hono<{ Bindings: Env }>();
app.use("/*", cors());

app.post("/api/sessions/start", async (c) => {
  const { jobArea, candidateName } = await c.req.json();

  const sessionId = crypto.randomUUID();

  const id = c.env.INTERVIEW_SESSION.idFromName(sessionId);
  const stub = c.env.INTERVIEW_SESSION.get(id);

  const session = await stub.initialize(jobArea, candidateName);

  return c.json({
    sessionId: sessionId,
    jobArea: session.jobArea,
    candidateName: session.candidateName,
    createdAt: session.createddAt,
  });
});


app.post("/api/chat", async (c) => {
  const { sessionId, message } = await c.req.json();

  const id = c.env.INTERVIEW_SESSION.idFromName(sessionId);
  const stub = c.env.INTERVIEW_SESSION.get(id);

  const { messages } = await stub.getHistory();

  const aiResponse = await c.env.AI.run(AI_MODEL, {
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.interviewer },
      ...messages.map((msg: { role: string; content: string }) => ({ role: msg.role, content: msg.content })),
      { role: "user", content: message },
    ],
  });

  const aiText = typeof aiResponse === "string" ? aiResponse : JSON.stringify(aiResponse);

  await stub.addMessage("user", message);
  await stub.addMessage("assistant", aiText);

  return c.json({
    response: aiText,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/sessions/:sessionId/history", async (c) => {
  try{
    const sessionId  = c.req.param("sessionId");

    if (!sessionId) {
      return c.json({ error: "Session ID is required" }, 400);
    }

    const id = c.env.INTERVIEW_SESSION.idFromName(sessionId);
    const stub = c.env.INTERVIEW_SESSION.get(id);

    const history = await stub.getHistory();

    if (!history.session) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json(history);

  }catch (error) {
    console.error("Error fetching session history:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

app.get("/api/sessions/:sessionId/feedback", async (c) => {
  try{
    const sessionId  = c.req.param("sessionId");
    if (!sessionId) {
      return c.json({ error: "Session ID is required" }, 400);
    }
    const id = c.env.INTERVIEW_SESSION.idFromName(sessionId);
    const stub = c.env.INTERVIEW_SESSION.get(id);

  const { messages, session } = await stub.getHistory();

  const feedback = await c.env.AI.run(AI_MODEL, {
    messages: [
      { role: "system", content: FEEDBACK_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({ role: msg.role, content: msg.content })),
    ],
  });

  const feedbackText = typeof feedback === "string" ? feedback : JSON.stringify(feedback);

  return c.json({
    feedback: feedbackText,
    jobArea: session.jobArea,
    candidateName: session.candidateName,
    timestamp: new Date().toISOString(),
  });
}catch (error) {
    console.error("Error fetching feedback:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    ai_available: !!c.env.AI,
    durable_objects_available: !!c.env.INTERVIEW_SESSION,
  });
});

app.get("/", (c) => c.json({ message: "API Running" }));

export { InterviewSession };
export default app;
