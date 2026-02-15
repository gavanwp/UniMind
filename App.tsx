import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatPanel from './components/ChatPanel';
import RightPanel from './components/RightPanel';
import UploadNotesPage from './components/UploadNotesPage';
import ProfilePage from './components/ProfilePage';
import PlaceholderPage from './components/PlaceholderPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ConfigurationErrorPage from './components/ConfigurationErrorPage';
import type { Message, User } from './types';
import { supabase, getProfile, isSupabaseConfigured } from './services/supabaseClient';
// FIX: Import the 'Icon' component to resolve 'Cannot find name 'Icon'' error.
import Icon from './components/Icon';

const initialMessages: Message[] = [
    {
        id: '1',
        sender: 'user',
        text: "Can you help me understand the concept of 'Recursion' in Python with an example?",
    },
    {
        id: '2',
        sender: 'ai',
        text: "Absolutely! Recursion is when a function calls itself to solve a problem. Here's a simple Python example for calculating a factorial:\n\n```python\ndef factorial(n):\n    if n == 1:\n        return 1\n    else:\n        return n * factorial(n-1)\n\nprint(factorial(5)) # Output: 120\n```\nWould you like me to explain the base case and recursive step in more detail?",
        suggestions: ['Explain Base Case', 'Show another example', 'Practice Recursion MCQs']
    },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    // If supabase is not configured, don't attempt to check session.
    if (!isSupabaseConfigured || !supabase) {
        setIsLoadingSession(false);
        return;
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await getProfile(session.user.id);
        setCurrentUser(profile);
        setIsAuthenticated(true);
      }
      setIsLoadingSession(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
            const profile = await getProfile(session.user.id);
            setCurrentUser(profile);
            setIsAuthenticated(true);
        } else {
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (!supabase) return; // Guard against unconfigured client
    const { error } = await supabase.auth.signOut();
    if(error) console.error("Error logging out:", error);
    setAuthView('login');
  };
  
  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleNavigate = (page: string) => {
    const pageMap: { [key: string]: string } = {
      'Dashboard': 'Dashboard',
      'Upload Notes': 'UploadNotes',
      'MCQ Generator': 'MCQGenerator',
      'Viva Mode': 'VivaMode',
      'Code Assistant': 'CodeAssistant',
      'Study Planner': 'StudyPlanner',
      'Profile': 'Profile'
    };
    setCurrentPage(pageMap[page] || 'Dashboard');
    setIsMobileMenuOpen(false);
  };

  const handleAnalysisComplete = (analysisText: string, fileNames: string[]) => {
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: `I've uploaded the following files for analysis: **${fileNames.join(', ')}**` };
    const aiMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: analysisText };
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setCurrentPage('Dashboard');
  };

  const renderCurrentPage = () => {
    if (!currentUser) return null;
    switch (currentPage) {
      case 'Dashboard': return <ChatPanel messages={messages} setMessages={setMessages} onNavigate={handleNavigate} />;
      case 'UploadNotes': return <UploadNotesPage onAnalysisComplete={handleAnalysisComplete} />;
      case 'Profile': return <ProfilePage user={currentUser} onLogout={handleLogout} onUpdateUser={setCurrentUser} />;
      case 'MCQGenerator': return <PlaceholderPage title="MCQ Generator" icon="mcq" />;
      case 'VivaMode': return <PlaceholderPage title="Viva Mode" icon="viva" />;
      case 'CodeAssistant': return <PlaceholderPage title="Code Assistant" icon="code" />;
      case 'StudyPlanner': return <PlaceholderPage title="Study Planner" icon="planner" />;
      default: return <ChatPanel messages={messages} setMessages={setMessages} onNavigate={handleNavigate} />;
    }
  };

  // Add the configuration check at the very top of the render logic.
  if (!isSupabaseConfigured) {
      return <ConfigurationErrorPage />;
  }
  
  if (isLoadingSession) {
      return (
        <div className="min-h-screen bg-[#0d0c22] flex items-center justify-center">
            <Icon name="logo" className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#0d0c22] text-white p-4 md:p-6 relative">
      <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-400/20 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>
          <div className="absolute top-[20%] right-[15%] w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
      </div>

      {!isAuthenticated ? (
         <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)]">
          {authView === 'login' ? (
            <LoginPage onSwitchToRegister={() => setAuthView('register')} />
          ) : (
            <RegisterPage onSwitchToLogin={() => setAuthView('login')} onRegisterSuccess={handleRegisterSuccess} />
          )}
        </main>
      ) : (
        currentUser && (
            <main className="relative z-10 lg:grid lg:grid-cols-12 lg:gap-6">
              <Sidebar onNavigate={handleNavigate} currentPage={currentPage} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}/>
              <div className="flex flex-col gap-6 lg:col-start-3 lg:col-span-7">
                <Header user={currentUser} onNavigateToProfile={() => handleNavigate('Profile')} onToggleMobileMenu={() => setIsMobileMenuOpen(true)}/>
                <div className="min-h-[calc(100vh-180px)]">
                    {renderCurrentPage()}
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-3">
                <RightPanel />
              </div>
              <div className="mt-6 lg:hidden">
                <RightPanel />
              </div>
            </main>
        )
      )}
    </div>
  );
};

export default App;
