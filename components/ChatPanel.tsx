import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import Icon from './Icon';
import { generateResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

interface ChatPanelProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    onNavigate: (page: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, setMessages, onNavigate }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const newUserMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        const aiResponseText = await generateResponse(input);

        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: aiResponseText,
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
        const newUserMessage: Message = { id: Date.now().toString(), sender: 'user', text: suggestion };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        generateResponse(suggestion).then(aiResponseText => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: aiResponseText,
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsLoading(false);
        });
    }

    const featureButtons = [
      { label: "📄 Upload Notes", feature: "Upload Notes", type: 'navigate' },
      { label: "📝 Generate MCQs", feature: "MCQ Generator", type: 'navigate' },
      { label: "🎤 Viva Mode", feature: "Viva Mode", type: 'navigate' },
      { label: "📚 Simplify Concept", feature: "Simplify Concept", type: 'prompt' },
      { label: "💻 Fix My Code", feature: "Fix My Code", type: 'prompt' },
      { label: "📅 Make Study Plan", feature: "Study Planner", type: 'navigate' },
    ];

    const handleFeatureButtonClick = (feature: string, type: string) => {
        if (type === 'navigate') {
            onNavigate(feature);
        } else {
            handleSuggestionClick(feature);
        }
    };


    return (
        <div className="glass-card rounded-2xl p-4 md:p-6 flex flex-col h-full overflow-hidden">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-full"></span>
                AI Academic Assistant
            </h2>
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 space-y-6 mb-4">
                {messages.map((msg, index) => (
                    <div key={msg.id} className={`flex items-start gap-3 md:gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && (
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center">
                                <Icon name="logo" className="w-5 h-5 md:w-6 md:h-6 text-white"/>
                            </div>
                        )}
                        <div className={`max-w-xl ${msg.sender === 'user' ? 'bg-blue-600/80 rounded-2xl rounded-br-none p-3 md:p-4' : 'rounded-2xl rounded-bl-none p-3 md:p-4 bg-gradient-to-br from-purple-800/50 to-indigo-700/50'}`}>
                           <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown
                                children={msg.text || ''}
                                components={{ code: CodeBlock }}
                            />
                           </div>
                            {msg.sender === 'ai' && msg.suggestions && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {msg.suggestions.map(s => (
                                        <button key={s} onClick={() => handleSuggestionClick(s)} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">{s}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {msg.sender === 'user' && (
                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 bg-gray-700 flex items-center justify-center">
                               <Icon name="user" className="w-5 h-5 md:w-6 md:h-6 text-gray-300"/>
                           </div>
                        )}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center animate-pulse">
                             <Icon name="logo" className="w-6 h-6 text-white"/>
                        </div>
                        <div className="max-w-xl rounded-2xl rounded-bl-none p-4 bg-gradient-to-br from-purple-800/50 to-indigo-700/50">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150"></span>
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="mt-auto pt-4 border-t border-white/10">
                 {messages.length > 0 && messages[messages.length-1].sender === 'ai' && !isLoading && (
                    <div className="overflow-x-auto pb-2 -mb-2">
                        <div className="flex flex-nowrap gap-2 mb-4">
                            {featureButtons.map(btn => (
                                <button key={btn.feature} onClick={() => handleFeatureButtonClick(btn.feature, btn.type)} className="text-xs flex-shrink-0 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">{btn.label}</button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type message..."
                        className="w-full bg-black/20 border border-white/10 rounded-full pl-5 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-600 to-cyan-500 w-9 h-9 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon name="send" className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;