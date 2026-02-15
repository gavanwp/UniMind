
import React from 'react';
import UpcomingDeadlines from './UpcomingDeadlines';
import RecentActivity from './RecentActivity';

const RightPanel: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <UpcomingDeadlines />
      <RecentActivity />
    </div>
  );
};

export default RightPanel;
