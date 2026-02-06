import { DurableObject } from "cloudflare:workers";

interface Message {
    role: string;
    content: string;
    timestamp: string;
}

interface SessionData {
    sessionID: string;
    jobArea: string;
    candidateName: string;
    createddAt: string;
    updatedAt: string;
}

export class InterviewSession extends DurableObject<Env> {
    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env);
    }

    async initialize(jobArea: string, candidateName: string) : Promise<SessionData> {
        const sessionData = {
            sessionID: this.ctx.id.toString(),
            jobArea,
            candidateName,
            createddAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await this.ctx.storage.put("session", sessionData);
        return sessionData;
    }

    async addMessage(role: string, content: string): Promise<void> {
        const messages = (await this.ctx.storage.get<Message[]>("messages")) || [];

        messages.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });

        await this.ctx.storage.put("messages", messages);

        const session = await this.ctx.storage.get<SessionData>("session");
        if (session) {
            session.updatedAt = new Date().toISOString();
            await this.ctx.storage.put("session", session);
        }
    }

    
    async getHistory(): Promise<{ session: SessionData | null; messages: Message[] }> {
        const session = await this.ctx.storage.get<SessionData>("session") || null;
        const messages = (await this.ctx.storage.get<Message[]>("messages")) || [];
        return { session, messages };
    }

    async clear(): Promise<void> {
        await this.ctx.storage.deleteAll();
    }

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);
        
        try {
        if (request.method === 'POST' && url.pathname === '/initialize') {
            const { jobArea, candidateName } = await request.json<{ jobArea: string; candidateName: string }>();
            const session = await this.initialize(jobArea, candidateName);
            return Response.json({ success: true, session });
        }
        
        if (request.method === 'POST' && url.pathname === '/message') {
            const { role, content } = await request.json<{ role: string; content: string }>();
            await this.addMessage(role, content);
            return Response.json({ success: true });
        }
        
        if (request.method === 'GET' && url.pathname === '/history') {
            const history = await this.getHistory();
            return Response.json(history);
        }
        
        if (request.method === 'DELETE' && url.pathname === '/clear') {
            await this.clear();
            return Response.json({ success: true });
        }
        
        return Response.json({ error: 'Not Found' }, { status: 404 });
        
        } catch (error) {
            return Response.json({ error: String(error) }, { status: 500 });
        }
    }
}