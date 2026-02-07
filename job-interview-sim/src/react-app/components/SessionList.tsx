import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { ArrowLeft, MessageSquare, Trash2 } from 'lucide-react';

interface Session {
    sessionId: string;
    jobArea: string;
    candidateName: string;
    createdAt: string;
}

interface SessionListProps {
    onLoadSession: (session: Session) => void;
    onBack: () => void;
}

export default function SessionList({ onLoadSession, onBack }: SessionListProps) {
    const [sessions, setSessions] = useState<Session[]>([]);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = () => {
        const saved = localStorage.getItem('sessions');
        if (saved) {
            setSessions(JSON.parse(saved));
        }
    };

    const deleteSession = (sessionId: string) => {
        const filtered = sessions.filter(s => s.sessionId !== sessionId);
        setSessions(filtered);
        localStorage.setItem('sessions', JSON.stringify(filtered));
    };

    const clearAll = () => {
        if (confirm('Delete all sessions?')) {
            setSessions([]);
            localStorage.removeItem('sessions');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={onBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        {sessions.length > 0 && (
                            <Button variant="destructive" size="sm" onClick={clearAll}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear All
                            </Button>
                        )}
                    </div>
                    <CardTitle className="text-2xl">Previous Sessions</CardTitle>
                    <CardDescription>
                        Resume a previous interview or review past sessions
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No previous sessions</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Start your first interview to see it here
                            </p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[500px]">
                            <div className="space-y-3">
                                {sessions.map((session) => (
                                    <Card key={session.sessionId} className="hover:bg-accent/50 transition-colors">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{session.candidateName}</h3>
                                                    <div className="flex gap-2 mt-2">
                                                        <Badge variant="secondary">{session.jobArea}</Badge>
                                                        <Badge variant="outline">
                                                            {new Date(session.createdAt).toLocaleDateString()}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => onLoadSession(session)}
                                                    >
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Resume
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteSession(session.sessionId)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}