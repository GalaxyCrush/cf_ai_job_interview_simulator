import { Hono } from "hono";
import { cors } from "hono/cors";
import { AI_MODEL, SYSTEM_PROMPTS } from "./constants";

const app = new Hono<{ Bindings: Env }>();
app.use("/*", cors());

app.post("/api/chat", async (c) => {
  const { message } = await c.req.json();

  const response = await c.env.AI.run(AI_MODEL, {
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.interviewer },
      { role: "user", content: message },
    ],
  });

  return c.json({
    response: response,
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (c) => c.json({ message: "API Running" }));

export default app;
