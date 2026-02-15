
import React, { useState } from 'react';
import Icon from './Icon';
import { supabase } from '../services/supabaseClient';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        setError(error.message);
    }
    // On success, the onAuthStateChange listener in App.tsx will handle the rest.
    setIsLoading(false);
  };

  return (
    <div className="glass-card rounded-2xl p-8 md:p-12 w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-cyan-400 p-3 rounded-xl mb-4">
          <Icon name="logo" className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-400 text-sm">Log in to continue to UniMind AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-400 text-sm text-center bg-red-500/20 p-3 rounded-lg">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50"
            placeholder="e.g., aisha.khan@university.edu.pk"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-br from-purple-600 to-cyan-500 text-white font-semibold py-3 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToRegister} className="font-medium text-purple-400 hover:underline">
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
