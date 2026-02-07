import { useState, useEffect } from 'react';
import { api, FeedbackResponse } from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';

interface FeedbackPanelProps {
    sessionId: string;
    jobArea: string;
    candidateName: string;
    onStartNew: () => void;
}

export default function FeedBackPanel({
    sessionId,
    jobArea,
    candidateName,
    onStartNew
}: FeedbackPanelProps) {
    const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFeedback();
    }, [sessionId]);

    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.getFeedback(sessionId);
            setFeedback(response);
        } catch (err) {
            console.error('Error fetching feedback:', err);
            setError('Failed to fetch feedback');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium">Generating your feedback...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Our AI is analyzing your interview
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-12 text-center">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={fetchFeedback}>Try Again</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-3xl mx-auto shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl">Interview Feedback</CardTitle>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{candidateName}</Badge>
                            <Badge variant="outline">{jobArea}</Badge>
                        </div>
                    </div>
                    <Button onClick={onStartNew} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        New Interview
                    </Button>
                </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-6 space-y-6">
                {/* Text Feedback */}
                <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        AI Analysis
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                            {feedback?.feedback}
                        </pre>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Messages Exchanged</p>
                            <p className="text-2xl font-bold">{feedback?.messageCount}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Interview Date</p>
                            <p className="text-sm font-medium">
                                {feedback?.timestamp ? new Date(feedback.timestamp).toLocaleDateString() : 'N/A'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
}