import { useState, useEffect, useRef } from 'react';
import { api, ChatMessage } from '../services/api';

export function useChat(sessionId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {loadHistory();}, [sessionId]);
    useEffect(() => {scrollToBottom();}, [messages]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadHistory = async () => {
        try {
            const history = await api.getHistory(sessionId);
            setMessages(history.messages || []);
        } catch (err) {
            console.error('Error loading chat history:', err);
            setError('Failed to load chat history');
        }
    };

    const sendMessage = async (content: string) => {
        if(!content.trim()) return;

        setLoading(true);
        setError(null);

        const userMessage: ChatMessage = {
            role: 'user',
            content: content.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await api.sendMessage({ sessionId, message: content.trim() });
            const aiMessage: ChatMessage = {
                role: 'assistant',
                content: response.response,
                timestamp: response.timestamp,
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        } finally {
            setLoading(false);
        }
       
    };

    return { messages, loading, error, sendMessage, messagesEndRef };
};