import { ChatMessage } from '../services/api';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface MessageBubbleProps {
    message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isAI = message.role === 'assistant';

    return (
        <div className={cn('flex gap-3 mb-4', isAI ? 'justify-start' : 'justify-end')}>
            {isAI && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}

            <div
                className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-2',
                    isAI
                        ? 'bg-muted text-foreground'
                        : 'bg-primary text-primary-foreground'
                )}
            >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                </span>
            </div>

            {!isAI && (
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary">
                        <User className="h-4 w-4" />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}