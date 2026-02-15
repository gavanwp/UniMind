
import React from 'react';
import Icon from './Icon';

const activities = [
  { icon: 'document', text: 'Generated 20 MCQs from "Introduction to Algorithms"', time: '20 minutes ago', color: 'bg-blue-500' },
  { icon: 'database', text: 'Practiced Viva for "Database Management"', time: '20 minutes ago', color: 'bg-purple-500' },
  { icon: 'code', text: 'Code Assistant helped with "Linked List implementation"', time: '20 minutes ago', color: 'bg-green-500' },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6 flex-grow">
      <h2 className="font-semibold mb-6 text-white">Recent Activity</h2>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/10"></div>
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 mb-6">
            <div className={`relative z-10 w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${activity.color}`}>
              <Icon name={activity.icon} className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-200">{activity.text}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
