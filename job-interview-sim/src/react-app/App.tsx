// src/App.tsx

import { useState, useEffect } from "react";
import SessionStart from './components/SessionStart';
import ChatInterface from './components/ChatInterface';
import FeedbackPanel from './components/FeedbackPanel';
import "./App.css";

type AppState = "start" | "chat" | "feedback";


function App() {
	const [currentState, setCurrentState] = useState<AppState>("start");
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [jobArea, setJobArea] = useState<string>('');
	const [candidateName, setCandidateName] = useState<string>('');

	// Load session from localstorage
	useEffect(() => {
		const savedSessionId = localStorage.getItem("sessionId");
		const savedJobArea = localStorage.getItem("jobArea");
		const savedCandidateName = localStorage.getItem("candidateName");

		if (savedCandidateName && savedJobArea && savedSessionId) {
			setSessionId(savedSessionId);
			setJobArea(savedJobArea);
			setCandidateName(savedCandidateName);
			setCurrentState("chat");
		}
	}, []);

	const handleSessionStart = (id: string, jobArea: string, candidateName: string) => {
		setSessionId(id);
		setJobArea(jobArea);
		setCandidateName(candidateName);

		localStorage.setItem("sessionId", id);
		localStorage.setItem("jobArea", jobArea);
		localStorage.setItem("candidateName", candidateName);

		setCurrentState("chat");
	};

	const handleEndInterview = () => {
		setCurrentState("feedback");
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<div className="container mx-auto px-4 py-8">
				{currentState === 'start' && (
					<SessionStart onSessionStart={handleSessionStart} />
				)}

				{currentState === 'chat' && sessionId && (
					<ChatInterface
						sessionId={sessionId}
						jobArea={jobArea}
						candidateName={candidateName}
						onEndInterview={handleEndInterview}
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
