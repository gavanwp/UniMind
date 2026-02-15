
import React from 'react';
import Icon from './Icon';

interface PlaceholderPageProps {
  title: string;
  icon: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon }) => {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-full items-center justify-center text-center">
      <div className="bg-gradient-to-br from-purple-600 to-cyan-400 p-4 rounded-full mb-6">
          <Icon name={icon} className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 max-w-md">
        This feature is currently under construction. We're working hard to bring it to you soon. Stay tuned for updates!
      </p>
    </div>
  );
};

export default PlaceholderPage;
