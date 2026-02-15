
import React, { useState } from 'react';
import Icon from './Icon';
import { supabase } from '../services/supabaseClient';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordInput = ({ label, id, value, onChange, disabled }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
        <input
            type="password"
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all disabled:opacity-50"
        />
    </div>
);

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.id]: e.target.value });
    setError(null);
    setSuccess(null);
  };
  
  const handleSave = async () => {
      if (passwords.newPassword.length < 6) {
          setError("Password must be at least 6 characters long.");
          return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
          setError("New passwords do not match.");
          return;
      }
      
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const { error } = await supabase.auth.updateUser({
          password: passwords.newPassword
      });

      if (error) {
          setError(error.message);
      } else {
          setSuccess("Password updated successfully!");
          setPasswords({ newPassword: '', confirmPassword: ''});
      }
      setIsLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Change Password</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <Icon name="x-circle" className="w-7 h-7" />
            </button>
        </div>
        
        {error && <p className="text-red-400 text-sm text-center bg-red-500/20 p-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center bg-green-500/20 p-3 rounded-lg mb-4">{success}</p>}

        <div className="space-y-4">
            <PasswordInput label="New Password" id="newPassword" value={passwords.newPassword} onChange={handleChange} disabled={isLoading} />
            <PasswordInput label="Confirm New Password" id="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} disabled={isLoading} />
        </div>

        <div className="flex items-center justify-end gap-4 mt-8">
            <button onClick={onClose} className="bg-black/20 hover:bg-black/40 text-sm text-gray-300 font-medium py-2 px-5 rounded-lg transition-colors">
                Cancel
            </button>
            <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-br from-purple-600 to-cyan-500 text-white font-semibold py-2 px-5 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-wait"
            >
                {isLoading ? 'Saving...' : 'Save Password'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
