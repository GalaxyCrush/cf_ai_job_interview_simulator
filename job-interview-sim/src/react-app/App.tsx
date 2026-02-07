// src/App.tsx

import { useState } from "react";
import SessionStart from './components/SessionStart';
import ChatInterface from './components/ChatInterface';
import FeedbackPanel from './components/FeedbackPanel';
import SessionList from './components/SessionList';
import "./App.css";

type AppState = 'start' | 'chat' | 'feedback' | 'sessions';

interface Session {
	sessionId: string;
	jobArea: string;
	candidateName: string;
	createdAt: string;
}


function App() {
	const [currentState, setCurrentState] = useState<AppState>("start");
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [jobArea, setJobArea] = useState<string>('');
	const [candidateName, setCandidateName] = useState<string>('');

	const handleSessionStart = (id: string, area: string, name: string) => {
		setSessionId(id);
		setJobArea(area);
		setCandidateName(name);

		const sessions: Session[] = JSON.parse(localStorage.getItem('sessions') || '[]');
		sessions.unshift({
			sessionId: id,
			jobArea: area,
			candidateName: name,
			createdAt: new Date().toISOString(),
		});

		if (sessions.length > 10) {
			sessions.pop();
		}

		localStorage.setItem('sessions', JSON.stringify(sessions));

		setCurrentState('chat');
	};

	const handleEndInterview = () => {
		setCurrentState('feedback');
	};

	const handleViewSessions = () => {
		setCurrentState('sessions');
	};

	const handleStartNew = () => {

		localStorage.removeItem("sessionId");
		localStorage.removeItem("jobArea");
		localStorage.removeItem("candidateName");

		setSessionId(null);
		setJobArea('');
		setCandidateName('');
		setCurrentState("start");
	};

	const handleBackToStart = () => {
		setCurrentState('start');
	};

	const handleLoadSession = (session: Session) => {
		setSessionId(session.sessionId);
		setJobArea(session.jobArea);
		setCandidateName(session.candidateName);
		setCurrentState('chat');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<div className="container mx-auto px-4 py-8">
				{currentState === 'start' && (
					<SessionStart
						onSessionStart={handleSessionStart}
						onViewSessions={handleViewSessions}
					/>
				)}

				{currentState === 'sessions' && (
					<SessionList
						onLoadSession={handleLoadSession}
						onBack={handleBackToStart}
					/>
				)}

				{currentState === 'chat' && sessionId && (
					<ChatInterface
						sessionId={sessionId}
						jobArea={jobArea}
						candidateName={candidateName}
						onEndInterview={handleEndInterview}
						onBackToStart={handleStartNew}
					/>
				)}

				{currentState === 'feedback' && sessionId && (
					<FeedbackPanel
						sessionId={sessionId}
						jobArea={jobArea}
						candidateName={candidateName}
						onStartNew={handleStartNew}
					/>
				)}
			</div>
		</div>
	);
}
export default App;
