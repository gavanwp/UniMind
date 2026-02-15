import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import SubjectProgress from './SubjectProgress';
import RecentActivity from './RecentActivity';
import PasswordChangeModal from './PasswordChangeModal';
import type { User } from '../types';
import { supabase } from '../services/supabaseClient';

const ProfileInput = ({ label, id, value, onChange, type = 'text' }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
    </div>
);

const ToggleSwitch = ({ label, enabled, setEnabled }: { label: string, enabled: boolean, setEnabled: (enabled: boolean) => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-purple-600' : 'bg-black/30'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    </div>
);

interface ProfilePageProps {
    user: User;
    onLogout: () => void;
    onUpdateUser: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onUpdateUser }) => {
    const [profileData, setProfileData] = useState(user);
    const [avatarUrl, setAvatarUrl] = useState(`https://picsum.photos/seed/${user.fullName.split(' ').join('')}/128/128`);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setProfileData(user);
        setAvatarUrl(`https://picsum.photos/seed/${user.fullName.split(' ').join('')}/128/128`);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({ ...profileData, [e.target.id]: e.target.value });
        if (!isDirty) setIsDirty(true);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarUrl(URL.createObjectURL(file));
            setIsDirty(true);
        }
    };
    
    const triggerAvatarUpload = () => {
        avatarInputRef.current?.click();
    };

    const handleSaveChanges = async () => {
        if (!isDirty || isSaving) return;
        setIsSaving(true);
        
        const { id, ...updateData } = profileData;

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            alert("Error updating profile: " + error.message);
        } else if (data) {
            onUpdateUser(data); // Update the user state in the main App component
            setIsDirty(false);
            // You might want to show a success toast message here.
        }
        setIsSaving(false);
    };

    return (
        <>
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                    <img src={avatarUrl} alt={profileData.fullName} className="w-32 h-32 rounded-full border-4 border-white/20 object-cover" />
                    <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                        accept="image/png, image/jpeg"
                    />
                    <button onClick={triggerAvatarUpload} className="absolute bottom-1 right-1 bg-purple-600 hover:bg-purple-700 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#1a1932]">
                        <Icon name="upload" className="w-4 h-4 text-white" />
                    </button>
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white">{profileData.fullName}</h1>
                    <p className="text-gray-400 mt-1">{profileData.degree} Student | {profileData.university}</p>
                </div>
                <button
                    onClick={handleSaveChanges}
                    disabled={!isDirty || isSaving}
                    className="w-full md:w-auto bg-gradient-to-br from-purple-600 to-cyan-500 text-white font-semibold py-2 px-6 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                    <ProfileInput label="Full Name" id="fullName" value={profileData.fullName} onChange={handleChange} />
                    <ProfileInput label="Email Address" id="email" value={profileData.email} onChange={handleChange} type="email" />
                    <ProfileInput label="University" id="university" value={profileData.university} onChange={handleChange} />
                    <div className="grid grid-cols-2 gap-4">
                        <ProfileInput label="Degree Program" id="degree" value={profileData.degree} onChange={handleChange} />
                        <ProfileInput label="Current Semester" id="semester" value={profileData.semester} onChange={handleChange} />
                    </div>
                </div>

                 <div className="glass-card rounded-2xl p-6 space-y-4">
                     <h2 className="text-lg font-semibold text-white">Account Settings</h2>
                     <ToggleSwitch label="Email Notifications" enabled={notificationsEnabled} setEnabled={setNotificationsEnabled} />
                     <button onClick={() => setIsPasswordModalOpen(true)} className="w-full text-left bg-black/20 hover:bg-black/40 text-sm text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors">
                         Change Password
                     </button>
                      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-sm text-red-300 font-medium py-3 px-4 rounded-lg transition-colors">
                         <Icon name="logout" className="w-5 h-5"/>
                         Log Out
                     </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="h-full">
                     <SubjectProgress />
                 </div>
                 <div className="h-full">
                     <RecentActivity />
                 </div>
            </div>
        </div>
        <PasswordChangeModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
        </>
    );
};

export default ProfilePage;