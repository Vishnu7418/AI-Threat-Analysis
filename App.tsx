

import React, { useState, useEffect, useCallback, type FC, type ReactNode } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- TYPE DEFINITIONS ---
type Page = 'home' | 'about' | 'features' | 'how-it-works' | 'industries' | 'contact' | 'threat-analysis' | 'privacy-policy' | 'terms-of-service';

// --- ICONS ---
const ShieldIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>);
const DetectIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>);
const HuntIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>);
const NeutralizeIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>);
const BrainIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l.813-2.846a4.5 4.5 0 00-3.09-3.09L13.125 5.25l-.813 2.846a4.5 4.5 0 00-3.09 3.09L6.375 12l2.846.813a4.5 4.5 0 003.09 3.09L13.125 18.75l.813-2.846a4.5 4.5 0 003.09-3.09L21.75 12l-2.846-.813a4.5 4.5 0 00-3.09-3.09z" /></svg>);
const ZapIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>);
const CloudIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-9.632 0 3.75 3.75 0 00-1.332 7.257z" /></svg>);
const MenuIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const CloseIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const SpinnerIcon: FC<{ className?: string }> = ({ className }) => (<svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const EyeIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const EyeSlashIcon: FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" /></svg>);


// --- HELPER COMPONENTS ---
const NavLink: FC<{ page: Page; currentPage: Page; setPage: (page: Page) => void; children: ReactNode }> = ({ page, currentPage, setPage, children }) => (
    <button onClick={() => setPage(page)} className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-cyan-300 hover:bg-slate-700/50 ${currentPage === page ? 'text-cyan-400 text-glow' : 'text-slate-300'}`}>
        {children}
    </button>
);

const Section: FC<{ id: string; children: ReactNode; className?: string }> = ({ id, children, className }) => (
    <section id={id} className={`py-20 px-4 md:px-8 lg:px-16 ${className}`}>
        <div className="container mx-auto max-w-6xl">{children}</div>
    </section>
);

const FeatureCard: FC<{ icon: ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-cyan-900/30 hover:shadow-2xl hover:shadow-cyan-500/20">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-bold font-orbitron text-cyan-300 mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);

const MarkdownRenderer: FC<{ content: string }> = ({ content }) => {
    // Helper to render inline formatting like **bold**
    const renderWithInlineFormatting = (text: string): ReactNode => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const elements: ReactNode[] = [];
    const lines = content.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Headings (e.g., #, ##, ###)
        if (line.startsWith('#')) {
            const level = line.match(/^#+/)?.[0].length;
            const text = line.replace(/^#+\s*/, '');
            const headingContent = renderWithInlineFormatting(text);
            switch (level) {
                case 1: elements.push(<h1 key={i}>{headingContent}</h1>); break;
                case 2: elements.push(<h2 key={i}>{headingContent}</h2>); break;
                case 3: elements.push(<h3 key={i}>{headingContent}</h3>); break;
                case 4: elements.push(<h4 key={i}>{headingContent}</h4>); break;
                default: elements.push(<h5 key={i}>{headingContent}</h5>); break;
            }
            i++;
            continue;
        }

        // Code blocks (```)
        if (line.startsWith('```')) {
            const codeLines: string[] = [];
            i++; // Move past the opening ```
            while (i < lines.length && !lines[i].startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            elements.push(<pre key={i}><code>{codeLines.join('\n')}</code></pre>);
            i++; // Move past the closing ```
            continue;
        }

        // Unordered lists (* or -)
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            const listItems: ReactNode[] = [];
            while (i < lines.length && (lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('- '))) {
                const itemText = lines[i].trim().substring(2);
                listItems.push(<li key={i}>{renderWithInlineFormatting(itemText)}</li>);
                i++;
            }
            elements.push(<ul key={`ul-${i}`} className="list-disc list-inside">{listItems}</ul>);
            continue;
        }
        
        // Ordered lists (1., 2.)
        if (line.trim().match(/^\d+\.\s/)) {
            const listItems: ReactNode[] = [];
            while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
                 const itemText = lines[i].trim().replace(/^\d+\.\s/, '');
                 listItems.push(<li key={i}>{renderWithInlineFormatting(itemText)}</li>);
                 i++;
            }
            elements.push(<ol key={`ol-${i}`} className="list-decimal list-inside">{listItems}</ol>);
            continue;
        }

        // Paragraphs
        if (line.trim() !== '') {
            elements.push(<p key={i}>{renderWithInlineFormatting(line)}</p>);
        }

        i++;
    }

    return <>{elements}</>;
};

// --- PAGE COMPONENTS ---
const HomePage: FC<{ setPage: (page: Page) => void }> = ({ setPage }) => (
    <div className="min-h-screen flex items-center justify-center text-center circuit-bg px-4">
        <div className="content-wrapper">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-orbitron text-white mb-4">
                <span className="text-cyan-400 text-glow">AI</span> That Hunts Threats
            </h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-orbitron text-white mb-6">
                Before They Hunt You.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Autonomous Cyber Defense Powered by Artificial Intelligence.
            </p>
            <button onClick={() => setPage('threat-analysis')} className="bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:bg-cyan-400 hover:shadow-2xl hover:shadow-cyan-400/50 transform hover:scale-105 font-orbitron">
                Get Started
            </button>
        </div>
    </div>
);

const AboutPage: FC<{}> = () => (
    <Section id="about">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-orbitron text-cyan-400 text-glow">About LoomGuard AI</h2>
            <p className="text-slate-400 mt-4">Understanding our core mission in the fight against cyber threats.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-orbitron font-bold text-cyan-300 mb-2">What is an Automated Threat Hunter Agent?</h3>
                    <p className="text-slate-400">It's a sophisticated AI system designed to proactively and autonomously patrol your digital ecosystems. Unlike traditional security measures that react to known threats, our agent actively seeks out anomalies, suspicious patterns, and hidden vulnerabilities that signal a potential attack, neutralizing them before they can escalate.</p>
                </div>
                <div>
                    <h3 className="text-2xl font-orbitron font-bold text-cyan-300 mb-2">Why Your Business Needs It</h3>
                    <p className="text-slate-400">In today's landscape, cyberattacks are faster and more complex than ever. Human-led teams can't keep up. An AI-powered agent operates 24/7, with the speed and scale necessary to defend against modern automated threats, ensuring your business continuity and protecting your valuable assets.</p>
                </div>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-lg border border-cyan-500/20">
                <h3 className="text-2xl font-orbitron font-bold text-cyan-300 mb-4 text-center">Mission & Vision</h3>
                <BrainIcon className="w-24 h-24 text-cyan-500 mx-auto mb-4" />
                <p className="text-slate-400 text-center"><strong className="text-cyan-400">Mission:</strong> To democratize cutting-edge, autonomous cybersecurity, making proactive defense accessible to all businesses.</p>
                <p className="text-slate-400 text-center mt-2"><strong className="text-cyan-400">Vision:</strong> A future where digital infrastructure is inherently self-defending, allowing innovation to thrive without fear of cyber threats.</p>
            </div>
        </div>
    </Section>
);

const FeaturesPage: FC<{}> = () => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationStep, setSimulationStep] = useState(0);

    const handleSimulation = () => {
        setIsSimulating(true);
        setSimulationStep(1);
        setTimeout(() => setSimulationStep(2), 1500);
        setTimeout(() => setSimulationStep(3), 3000);
        setTimeout(() => {
            setIsSimulating(false);
            setSimulationStep(0);
        }, 4500);
    };

    const simulationMessages: { [key: number]: { text: string; color: string } } = {
        1: { text: "INCOMING THREAT DETECTED: [MALWARE_SIGNATURE_XJ21]", color: "text-red-500" },
        2: { text: "LOOMGUARD AI HUNTING & ISOLATING THREAT...", color: "text-yellow-500" },
        3: { text: "THREAT NEUTRALIZED. NETWORK SECURE.", color: "text-green-500" },
    };

    return (
        <Section id="features">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-orbitron text-cyan-400 text-glow">Core Features</h2>
                <p className="text-slate-400 mt-4">The arsenal of our AI-powered defense system.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard icon={<DetectIcon className="w-12 h-12 text-cyan-400" />} title="Real-Time Threat Detection" description="Our AI constantly scans for threats, analyzing data streams in milliseconds to catch attacks as they happen." />
                <FeatureCard icon={<ZapIcon className="w-12 h-12 text-cyan-400" />} title="Automated Response Actions" description="Upon detection, the agent instantly takes action—quarantining files, blocking IPs, or isolating systems to prevent spread." />
                <FeatureCard icon={<HuntIcon className="w-12 h-12 text-cyan-400" />} title="Continuous Monitoring" description="24/7/365 vigilance over your networks, endpoints, and cloud infrastructure without any downtime or human fatigue." />
                <FeatureCard icon={<BrainIcon className="w-12 h-12 text-cyan-400" />} title="Predictive AI Defense" description="Analyzes global threat intelligence to predict and prepare for future attack vectors before they are even used." />
                <FeatureCard icon={<ShieldIcon className="w-12 h-12 text-cyan-400" />} title="Self-Learning Algorithms" description="The AI learns from every encounter, constantly evolving its defensive strategies to become smarter and more effective over time." />
                <FeatureCard icon={<CloudIcon className="w-12 h-12 text-cyan-400" />} title="Cloud & Enterprise Ready" description="Seamless integration with major cloud platforms and scalable architecture to protect businesses of any size." />
            </div>
            <div className="mt-20 text-center">
                <button onClick={handleSimulation} disabled={isSimulating} className="bg-slate-800 border border-cyan-500 text-cyan-400 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:bg-cyan-500 hover:text-slate-900 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-orbitron">
                    {isSimulating ? 'SIMULATION IN PROGRESS...' : 'Simulate an Attack'}
                </button>
                {isSimulating && (
                    <div className="mt-6 p-4 bg-slate-900 rounded-lg max-w-md mx-auto border border-cyan-800">
                        <p className={`font-mono text-lg font-bold transition-opacity duration-500 ${simulationMessages[simulationStep].color}`}>
                            {simulationMessages[simulationStep].text}
                        </p>
                    </div>
                )}
            </div>
        </Section>
    );
};

const HowItWorksPage: FC<{}> = () => (
    <Section id="how-it-works">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-orbitron text-cyan-400 text-glow">How It Works</h2>
            <p className="text-slate-400 mt-4">A simple, three-step process to secure your digital world.</p>
        </div>
        <div className="relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-cyan-800/50 -translate-y-1/2"></div>
            <div className="hidden md:block absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-cyan-500 -translate-y-1/2 animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>

            <div className="grid md:grid-cols-3 gap-12 relative">
                <div className="text-center z-10">
                    <div className="w-24 h-24 mx-auto bg-slate-900 border-2 border-cyan-500 rounded-full flex items-center justify-center mb-4">
                        <DetectIcon className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-orbitron font-bold text-cyan-300 mb-2">1. Detect</h3>
                    <p className="text-slate-400">Our AI deploys advanced sensors across your network, continuously scanning trillions of data points for anomalies that deviate from baseline behavior.</p>
                </div>
                <div className="text-center z-10">
                    <div className="w-24 h-24 mx-auto bg-slate-900 border-2 border-cyan-500 rounded-full flex items-center justify-center mb-4">
                        <HuntIcon className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-orbitron font-bold text-cyan-300 mb-2">2. Hunt</h3>
                    <p className="text-slate-400">Once a potential threat is flagged, the agent autonomously investigates, tracking its origin, behavior, and potential impact in real-time without human intervention.</p>
                </div>
                <div className="text-center z-10">
                    <div className="w-24 h-24 mx-auto bg-slate-900 border-2 border-cyan-500 rounded-full flex items-center justify-center mb-4">
                        <NeutralizeIcon className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-orbitron font-bold text-cyan-300 mb-2">3. Neutralize</h3>
                    <p className="text-slate-400">Before damage can occur, the agent executes a precise response—blocking the attack, terminating malicious processes, and patching vulnerabilities to prevent re-entry.</p>
                </div>
            </div>
        </div>
    </Section>
);

const IndustriesPage: FC<{}> = () => (
    <Section id="industries">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-orbitron text-cyan-400 text-glow">Industries We Protect</h2>
            <p className="text-slate-400 mt-4">Tailored defense for the unique challenges of your sector.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/50 p-8 rounded-lg border border-cyan-500/20 text-center">
                <span className="text-5xl mb-4 inline-block">🏦</span>
                <h3 className="text-xl font-bold font-orbitron text-cyan-300 mb-2">Finance</h3>
                <p className="text-slate-400">Protecting sensitive financial data, preventing fraud, and ensuring regulatory compliance with 24/7 autonomous monitoring.</p>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-lg border border-cyan-500/20 text-center">
                <span className="text-5xl mb-4 inline-block">🏥</span>
                <h3 className="text-xl font-bold font-orbitron text-cyan-300 mb-2">Healthcare</h3>
                <p className="text-slate-400">Securing patient records (EHR), medical devices (IoT), and hospital networks from ransomware and data breaches.</p>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-lg border border-cyan-500/20 text-center">
                <span className="text-5xl mb-4 inline-block">🛡️</span>
                <h3 className="text-xl font-bold font-orbitron text-cyan-300 mb-2">Government</h3>
                <p className="text-slate-400">Defending critical national infrastructure, public sector data, and government agencies from state-sponsored cyberattacks.</p>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-lg border border-cyan-500/20 text-center">
                <span className="text-5xl mb-4 inline-block">💼</span>
                <h3 className="text-xl font-bold font-orbitron text-cyan-300 mb-2">Small Businesses</h3>
                <p className="text-slate-400">Providing enterprise-grade security that is affordable and easy to deploy, protecting the backbone of our economy.</p>
            </div>
        </div>
    </Section>
);

const ThreatAnalysisPage: FC<{}> = () => {
    const [inputText, setInputText] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalysis = async () => {
        if (!apiKey.trim()) {
            setError('Please configure your API Key before analyzing.');
            setShowApiKeyInput(true);
            return;
        }
        if (!inputText.trim()) {
            setError('Input cannot be empty.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: inputText,
                config: {
                    systemInstruction: "You are a world-class cybersecurity analyst AI. Analyze the following text for potential security threats, vulnerabilities, or malicious intent. Provide a concise, clear, and actionable report. Use markdown for formatting, including code blocks for code snippets. Structure your response with a 'Summary', 'Threat Level' (e.g., Low, Medium, High, Critical), 'Detailed Findings', and 'Recommendations'.",
                },
            });
            setAnalysisResult(response.text);
        } catch (e: any) {
            const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            console.error(`[${new Date().toISOString()}] Analysis Error ID: ${errorId}`, e);
            setError(`Failed to analyze the text. An unexpected error occurred. Please try again later or contact support with Error ID: ${errorId}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Section id="threat-analysis">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-orbitron text-cyan-400 text-glow">AI Threat Analysis</h2>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Paste a log file, code snippet, or any suspicious text. Our AI will analyze it for threats.</p>
            </div>
            <div className="max-w-4xl mx-auto">
                 <div className="mb-6">
                    {!showApiKeyInput ? (
                        <div className="text-center">
                            <button
                                onClick={() => setShowApiKeyInput(true)}
                                className="bg-slate-800 border border-slate-600 text-slate-300 font-bold py-2 px-6 rounded-full text-sm transition-all duration-300 hover:bg-slate-700 hover:border-cyan-500 hover:text-cyan-300 font-orbitron"
                                aria-label="Configure API Key"
                            >
                                Configure API Key
                            </button>
                        </div>
                    ) : (
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 transition-all duration-500 page-transition">
                            <label htmlFor="apiKey" className="block text-sm font-medium text-cyan-300 mb-2">API Key</label>
                            <div className="relative">
                                <input
                                    id="apiKey"
                                    type={isApiKeyVisible ? 'text' : 'password'}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your API Key"
                                    className="w-full bg-slate-950 text-slate-300 p-3 pr-12 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 font-mono"
                                />
                                <button
                                    onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-cyan-400"
                                    aria-label={isApiKeyVisible ? 'Hide API Key' : 'Show API Key'}
                                >
                                    {isApiKeyVisible ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900/50 p-6 rounded-lg border border-cyan-500/20">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste your text here for analysis..."
                        className="w-full h-64 bg-slate-950 text-slate-300 p-4 rounded-md border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 font-mono"
                        disabled={isLoading}
                        aria-label="Text for threat analysis"
                    />
                    <button
                        onClick={handleAnalysis}
                        disabled={isLoading}
                        className="mt-4 w-full flex items-center justify-center bg-cyan-600 text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:bg-cyan-500 hover:shadow-2xl hover:shadow-cyan-400/50 transform hover:scale-105 font-orbitron disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <><SpinnerIcon className="w-6 h-6 mr-3" /> Analyzing...</> : 'Analyze'}
                    </button>
                </div>

                <div className="mt-8" aria-live="polite">
                    {error && (
                        <div className="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg">
                            <h3 className="font-bold font-orbitron">Analysis Error</h3>
                            <p>{error}</p>
                        </div>
                    )}
                    {analysisResult && (
                        <div className="bg-slate-900/50 p-6 rounded-lg border border-cyan-500/20 page-transition">
                            <h3 className="text-2xl font-bold font-orbitron text-cyan-300 mb-4">Analysis Report</h3>
                            <div className="prose prose-invert prose-headings:text-cyan-400 prose-strong:text-slate-100 prose-li:marker:text-cyan-400 prose-pre:bg-slate-950 prose-pre:p-4 prose-pre:rounded-md max-w-none text-slate-300">
                                <MarkdownRenderer content={analysisResult} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
};

const ContactPage: FC<{}> = () => {
    const [formState, setFormState] = useState({ name: '', email: '', company: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form submission (e.g., API call)
        console.log("Form submitted:", formState);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <Section id="contact" className="text-center">
                 <h2 className="text-4xl font-bold font-orbitron text-cyan-400 text-glow">Thank You!</h2>
                 <p className="text-slate-300 mt-4 text-lg">Your request has been received. Our team will contact you shortly.</p>
            </Section>
        )
    }

    return (
        <Section id="contact">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-orbitron text-cyan-400 text-glow">Ready to Outthink Hackers?</h2>
                <p className="text-slate-400 mt-4">Request a free demo and see our AI in action.</p>
            </div>
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-cyan-300 mb-2">Name</label>
                        <input type="text" name="name" id="name" required value={formState.name} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2">Email</label>
                        <input type="email" name="email" id="email" required value={formState.email} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300" />
                    </div>
                     <div>
                        <label htmlFor="company" className="block text-sm font-medium text-cyan-300 mb-2">Company</label>
                        <input type="text" name="company" id="company" value={formState.company} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300" />
                    </div>
                    <div>
                         <label htmlFor="message" className="block text-sm font-medium text-cyan-300 mb-2">Message</label>
                        <textarea name="message" id="message" rows={4} value={formState.message} onChange={handleChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 hover:bg-cyan-400 hover:shadow-2xl hover:shadow-cyan-400/50 transform hover:scale-105 font-orbitron">
                        Request Free Demo
                    </button>
                </form>
            </div>
        </Section>
    );
};

const PrivacyPolicyPage: FC<{}> = () => (
    <Section id="privacy-policy">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-orbitron text-cyan-400 text-glow">Privacy Policy</h2>
            <p className="text-slate-400 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6 text-slate-300 prose prose-invert prose-headings:text-cyan-400 max-w-none">
            <h3>1. Introduction</h3>
            <p>Welcome to LoomGuard AI. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
            
            <h3>2. Information We Collect</h3>
            <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use.</p>

            <h3>3. How We Use Your Information</h3>
            <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            
            <h3>4. Will Your Information Be Shared With Anyone?</h3>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

            <h3>5. Do We Use Cookies and Other Tracking Technologies?</h3>
            <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.</p>
            
            <h3>6. How Do We Keep Your Information Safe?</h3>
            <p>We aim to protect your personal information through a system of organizational and technical security measures. We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
        </div>
    </Section>
);

const TermsOfServicePage: FC<{}> = () => (
    <Section id="terms-of-service">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-orbitron text-cyan-400 text-glow">Terms of Service</h2>
             <p className="text-slate-400 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6 text-slate-300 prose prose-invert prose-headings:text-cyan-400 max-w-none">
            <h3>1. Agreement to Terms</h3>
            <p>By using our services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the services. We may modify the Terms at any time, in our sole discretion. If we do so, we’ll let you know either by posting the modified Terms on the Site or through other communications.</p>
            
            <h3>2. Use of Services</h3>
            <p>You may use the Services only if you are not barred from using the Services under applicable law. You agree not to use the Services for any illegal or unauthorized purpose. You agree to comply with all laws, rules, and regulations applicable to your use of the Services.</p>

            <h3>3. Intellectual Property</h3>
            <p>The Service and its original content, features and functionality are and will remain the exclusive property of LoomGuard AI and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
            
            <h3>4. Termination</h3>
            <p>We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

            <h3>5. Limitation of Liability</h3>
            <p>In no event shall LoomGuard AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            
            <h3>6. Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us.</p>
        </div>
    </Section>
);


// --- MAIN APP COMPONENT ---
const App: FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const setPage = (page: Page) => {
        setCurrentPage(page);
        setIsMenuOpen(false);
        window.scrollTo(0, 0);
    }
    
    const renderPage = () => {
        switch (currentPage) {
            case 'home': return <HomePage setPage={setPage} />;
            case 'about': return <AboutPage />;
            case 'features': return <FeaturesPage />;
            case 'how-it-works': return <HowItWorksPage />;
            case 'industries': return <IndustriesPage />;
            case 'contact': return <ContactPage />;
            case 'threat-analysis': return <ThreatAnalysisPage />;
            case 'privacy-policy': return <PrivacyPolicyPage />;
            case 'terms-of-service': return <TermsOfServicePage />;
            default: return <HomePage setPage={setPage} />;
        }
    };

    const Header: FC = () => (
        <header className="bg-slate-950/80 backdrop-blur-sm border-b border-cyan-500/20 fixed top-0 left-0 right-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                         <button onClick={() => setPage('home')} className="flex-shrink-0 text-white text-2xl font-bold font-orbitron">
                            LoomGuard<span className="text-cyan-400 text-glow">AI</span>
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink page="home" currentPage={currentPage} setPage={setPage}>Home</NavLink>
                            <NavLink page="about" currentPage={currentPage} setPage={setPage}>About</NavLink>
                            <NavLink page="features" currentPage={currentPage} setPage={setPage}>Features</NavLink>
                            <NavLink page="how-it-works" currentPage={currentPage} setPage={setPage}>How It Works</NavLink>
                            <NavLink page="industries" currentPage={currentPage} setPage={setPage}>Industries</NavLink>
                             <NavLink page="threat-analysis" currentPage={currentPage} setPage={setPage}>Threat Analysis</NavLink>
                            <button onClick={() => setPage('contact')} className="ml-4 bg-cyan-500/20 border border-cyan-500 text-cyan-400 px-4 py-2 rounded-md text-sm font-medium hover:bg-cyan-500 hover:text-slate-900 transition-colors duration-300">Contact</button>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-cyan-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>
            {isMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink page="home" currentPage={currentPage} setPage={setPage}>Home</NavLink>
                        <NavLink page="about" currentPage={currentPage} setPage={setPage}>About</NavLink>
                        <NavLink page="features" currentPage={currentPage} setPage={setPage}>Features</NavLink>
                        <NavLink page="how-it-works" currentPage={currentPage} setPage={setPage}>How It Works</NavLink>
                        <NavLink page="industries" currentPage={currentPage} setPage={setPage}>Industries</NavLink>
                         <NavLink page="threat-analysis" currentPage={currentPage} setPage={setPage}>Threat Analysis</NavLink>
                        <button onClick={() => setPage('contact')} className="w-full text-left mt-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 px-3 py-2 rounded-md text-sm font-medium hover:bg-cyan-500 hover:text-slate-900 transition-colors duration-300">Contact</button>
                    </div>
                </div>
            )}
        </header>
    );

    const Footer: FC = () => (
         <footer className="bg-slate-950 border-t border-cyan-500/20 py-8 px-4">
             <div className="container mx-auto max-w-6xl text-center text-slate-500">
                 <p>&copy; {new Date().getFullYear()} LoomGuardAI. All Rights Reserved.</p>
                 <div className="flex justify-center space-x-4 mt-4">
                    <button onClick={() => setPage('privacy-policy')} className="hover:text-cyan-400 transition-colors">Privacy Policy</button>
                    <button onClick={() => setPage('terms-of-service')} className="hover:text-cyan-400 transition-colors">Terms of Service</button>
                 </div>
             </div>
         </footer>
    );

    return (
        <div className="text-slate-200 bg-slate-950 circuit-bg">
            <Header />
            <main key={currentPage} className={`pt-16 content-wrapper ${currentPage !== 'home' ? 'page-transition' : ''}`}>
                {renderPage()}
            </main>
            {currentPage !== 'home' && <Footer />}
        </div>
    );
};

export default App;
