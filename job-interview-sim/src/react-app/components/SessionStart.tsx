import { useState } from 'react';
import { api } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Sparkles, History } from 'lucide-react';

interface SessionStartProps {
    onSessionStart: (sessionId: string, jobArea: string, candidateName: string) => void;
    onViewSessions: () => void;
}

const JOB_AREAS = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'Mobile Developer',
];

export default function SessionStart({ onSessionStart, onViewSessions }: SessionStartProps) {
    const [candidateName, setCandidateName] = useState('');
    const [jobArea, setJobArea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStart = async () => {
        if (!candidateName || !jobArea) {
            setError('Please enter your name and select a job area.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.startSession({
                candidateName: candidateName.trim(),
                jobArea,
            });
            onSessionStart(response.sessionId, jobArea, candidateName.trim());
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to start session');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">AI Interview Simulator</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Practice your interview skills with AI-powered feedback
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Your Name
                        </label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="jobArea" className="text-sm font-medium">
                            Job Area
                        </label>
                        <Select value={jobArea} onValueChange={setJobArea} disabled={isLoading}>
                            <SelectTrigger id="jobArea">
                                <SelectValue placeholder="Select your area" />
                            </SelectTrigger>
                            <SelectContent>
                                {JOB_AREAS.map((area) => (
                                    <SelectItem key={area} value={area}>
                                        {area}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleStart}
                        disabled={isLoading || !candidateName.trim() || !jobArea}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Starting Interview...
                            </>
                        ) : (
                            'Start Interview'
                        )}
                    </Button>

                    { }
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onViewSessions}
                        disabled={isLoading}
                    >
                        <History className="mr-2 h-4 w-4" />
                        View Previous Sessions
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}