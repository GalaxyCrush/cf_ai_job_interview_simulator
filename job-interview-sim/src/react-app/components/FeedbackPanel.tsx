import { useState, useEffect } from 'react';
import { api, FeedbackResponse } from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Loader2, RefreshCw, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

interface FeedbackPanelProps {
    sessionId: string;
    jobArea: string;
    candidateName: string;
    onStartNew: () => void;
}

interface ParsedFeedback {
    score?: number;
    strengths?: string[];
    improvements?: string[];
    summary?: string;
    recommendation?: string;
}

export default function FeedbackPanel({
    sessionId,
    jobArea,
    candidateName,
    onStartNew,
}: FeedbackPanelProps) {
    const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadFeedback();
    }, [sessionId]);

    const loadFeedback = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.getFeedback(sessionId);
            setFeedback(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load feedback');
        } finally {
            setLoading(false);
        }
    };

    const parseFeedback = (): ParsedFeedback | string => {
        if (!feedback?.feedback) return '';

        if (typeof feedback.feedback === 'object') {
            return feedback.feedback as ParsedFeedback;
        }

        if (typeof feedback.feedback === 'string') {
            try {
                return JSON.parse(feedback.feedback) as ParsedFeedback;
            } catch {
                return feedback.feedback;
            }
        }

        return '';
    };

    const renderFeedback = () => {
        const parsed = parseFeedback();

        if (typeof parsed === 'string') {
            return (
                <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        AI Analysis
                    </h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{parsed}</pre>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* Score */}
                {parsed.score && (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                            <p className="text-5xl font-bold text-primary">{parsed.score}/100</p>
                        </CardContent>
                    </Card>
                )}

                {/* Strengths */}
                {parsed.strengths && parsed.strengths.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border border-green-200 dark:border-green-900">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                            Strengths
                        </h3>
                        <ul className="space-y-2">
                            {parsed.strengths.map((strength, i) => (
                                <li key={i} className="flex gap-2 text-sm">
                                    <span className="text-green-600 dark:text-green-500">✓</span>
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Improvements */}
                {parsed.improvements && parsed.improvements.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-6 border border-amber-200 dark:border-amber-900">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                            <TrendingUp className="h-5 w-5" />
                            Areas to Improve
                        </h3>
                        <ul className="space-y-2">
                            {parsed.improvements.map((improvement, i) => (
                                <li key={i} className="flex gap-2 text-sm">
                                    <span className="text-amber-600 dark:text-amber-500">→</span>
                                    <span>{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Summary */}
                {parsed.summary && (
                    <div className="bg-muted/50 rounded-lg p-6">
                        <h3 className="font-semibold mb-3">Summary</h3>
                        <p className="text-sm text-muted-foreground">{parsed.summary}</p>
                    </div>
                )}

                {/* Recommendation */}
                {parsed.recommendation && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-900">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            <AlertCircle className="h-5 w-5" />
                            Recommendation
                        </h3>
                        <p className="text-sm">{parsed.recommendation}</p>
                    </div>
                )}
            </div>
        );
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
                    <Button onClick={loadFeedback}>Try Again</Button>
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
                {renderFeedback()}

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 pt-4">
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