import React, { useState } from 'react';
import Icon from './Icon';
import { supabase } from '../services/supabaseClient';
import type { User } from '../types';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      university: '',
      degree: '',
      semester: '',
      password: '',
      confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
    });

    if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
    }

    if (authData.user) {
        const profileData: User = {
            id: authData.user.id,
            fullName: formData.fullName,
            email: formData.email,
            university: formData.university,
            degree: formData.degree,
            semester: formData.semester,
        };
        
        const { error: insertError } = await supabase
            .from('users')
            .insert(profileData);
        
        if (insertError) {
            setError(`Could not create profile: ${insertError.message}`);
            setIsLoading(false);
        } else {
            // On success, call the callback to update app state and "redirect"
            onRegisterSuccess(profileData);
        }
    } else {
        setError("An unknown error occurred during registration.");
        setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 md:p-12 w-full max-w-lg">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-cyan-400 p-3 rounded-xl mb-4">
          <Icon name="logo" className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-gray-400 text-sm">Join UniMind AI and excel in your studies</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-400 text-sm text-center bg-red-500/20 p-3 rounded-lg">{error}</p>}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
              <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} required disabled={isLoading} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50" placeholder="e.g., Bilal Ahmed" />
            </div>
             <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} required disabled={isLoading} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50" placeholder="bilal.ahmed@university.edu.pk" />
            </div>
         </div>
         <div>
            <label htmlFor="university" className="block text-xs font-medium text-gray-400 mb-1">University</label>
            <input type="text" id="university" value={formData.university} onChange={handleChange} required disabled={isLoading} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50" placeholder="e.g., FAST NUCES, Lahore" />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label htmlFor="degree" className="block text-xs font-medium text-gray-400 mb-1">Degree Program</label>
              <input type="text" id="degree" value={formData.degree} onChange={handleChange} required disabled={isLoading} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50" placeholder="B.Sc. Computer Science" />
            </div>
             <div>
              <label htmlFor="semester" className="block text-xs font-medium text-gray-400 mb-1">Current Semester</label>
              <input type="text" id="semester" value={formData.semester} onChange={handleChange} required disabled={isLoading} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50" placeholder="e.g., 6th" />
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-400 mb-1">Password</label>
              <input type="password" id="password" value={formData.password} onChange={handleChange} required disabled={isLoading} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50" placeholder="••••••••" />
            </div>
             <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-400 mb-1">Confirm Password</label>
              <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required disabled={isLoading} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50" placeholder="••••••••" />
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-br from-purple-600 to-cyan-500 text-white font-semibold py-3 rounded-lg transition-opacity hover:opacity-90 mt-6 disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-400 pt-2">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className="font-medium text-purple-400 hover:underline">
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;