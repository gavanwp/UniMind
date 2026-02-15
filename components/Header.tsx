import React, { useState } from 'react';
import Icon from './Icon';
import type { User } from '../types';
import { generateSearchResponse } from '../services/geminiService';
import SmartSearchModal from './SmartSearchModal';

type HeaderProps = {
  user: User;
  onNavigateToProfile: () => void;
  onToggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigateToProfile, onToggleMobileMenu }) => {
  const avatarSeed = user.fullName.split(' ').join('');
  const avatarUrl = `https://picsum.photos/seed/${avatarSeed}/40/40`;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResponse, setSearchResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery.trim() !== '') {
          setIsModalOpen(true);
          setIsLoading(true);
          setSearchResponse('');

          const response = await generateSearchResponse(searchQuery);
          
          setSearchResponse(response);
          setIsLoading(false);
      }
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setSearchQuery('');
      setSearchResponse('');
  }

  return (
    <>
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onToggleMobileMenu} className="lg:hidden text-gray-300 hover:text-white">
              <Icon name="menu" className="w-6 h-6"/>
          </button>
          <div className="relative flex-1 max-w-xs md:max-w-lg">
              <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ask anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-transparent border-none pl-11 pr-4 py-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Icon name="bell" className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d0c22]"></span>
          </div>
          <button onClick={onNavigateToProfile} className="flex items-center gap-3 glass-card rounded-full p-1 md:pr-4 cursor-pointer hover:bg-white/10 transition-colors">
            <img src={avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full" />
            <span className="font-medium text-sm hidden md:inline">{user.fullName}</span>
          </button>
        </div>
      </div>
      <SmartSearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        query={searchQuery}
        response={searchResponse}
        isLoading={isLoading}
      />
    </>
  );
};

export default Header;