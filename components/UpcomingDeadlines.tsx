
import React from 'react';

const Calendar: React.FC = () => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = [26, 27, 28, 30, 1, 2, 3]; // Example dates
  
  return (
    <div>
        <div className="flex justify-between items-center mb-3">
            <button className="text-gray-400 hover:text-white">&lt;</button>
            <h3 className="font-semibold text-sm">February 2023</h3>
            <button className="text-gray-400 hover:text-white">&gt;</button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-gray-400 gap-y-2">
            {days.map(day => <div key={day}>{day}</div>)}
            {dates.map((date, index) => (
                <div key={index} className={`py-1 rounded-full ${date === 26 ? 'bg-blue-500 text-white' : ''} ${date > 28 ? 'text-gray-500' : ''}`}>
                    {date}
                </div>
            ))}
        </div>
    </div>
  );
};

const UpcomingDeadlines: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="font-semibold mb-4 text-white">Upcoming Deadlines & Study Plan</h2>
      <Calendar />
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20">
            <div className="w-1 h-8 bg-cyan-400 rounded-full"></div>
            <p className="text-sm">Data Structures Assignment - <span className="font-semibold text-cyan-300">Due Tomorrow</span></p>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20">
            <div className="w-1 h-8 bg-pink-500 rounded-full"></div>
            <p className="text-sm">Prepare for OS Viva - <span className="font-semibold text-pink-400">Friday</span></p>
        </div>
      </div>
       <button className="text-sm text-gray-400 hover:text-white mt-4 w-full text-left">+ Add row with Tasks</button>
    </div>
  );
};

export default UpcomingDeadlines;
