import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Send, Loader2, Flag } from 'lucide-react';

interface ChatInterfaceProps {
    sessionId: string;
    jobArea: string;
    candidateName: string;
    onEndInterview: () => void;
}

export default function ChatInterface({
    sessionId,
    jobArea,
    candidateName,
    onEndInterview,
}: ChatInterfaceProps) {
    const [input, setInput] = useState('');
    const { messages, loading, error, sendMessage, messagesEndRef } = useChat(sessionId);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        await sendMessage(input);
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">AI Interview</CardTitle>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{candidateName}</Badge>
                            <Badge variant="outline">{jobArea}</Badge>
                        </div>
                    </div>
                    <Button variant="destructive" onClick={onEndInterview}>
                        <Flag className="mr-2 h-4 w-4" />
                        End Interview
                    </Button>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
                {/* Chat Area */}
                <ScrollArea className="h-[500px] p-6">
                    {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            <p>The interview will begin when you send your first message.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => <MessageBubble key={index} message={msg} />)
                    )}

                    {loading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI is typing...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </ScrollArea>

                {error && (
                    <div className="px-6 py-2 bg-destructive/10 border-t border-destructive/20">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t">
                    <div className="flex gap-2">
                        <Textarea
                            placeholder="Type your answer... (Shift+Enter for new line)"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                            className="min-h-[60px] resize-none"
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="h-[60px] w-[60px]"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Press Enter to send • Shift+Enter for new line
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};