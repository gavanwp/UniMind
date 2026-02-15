
import React from 'react';

const subjects = [
  { name: 'Computer Science', progress: 85, color: 'from-blue-400 to-cyan-300' },
  { name: 'Mathematics', progress: 70, color: 'from-purple-500 to-pink-400' },
  { name: 'Physics', progress: 90, color: 'from-indigo-500 to-purple-400' },
];

const SubjectProgress: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="font-semibold mb-4 text-white">Subject Progress</h2>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.name}>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-gray-300">{subject.name}</span>
              <span className="font-medium text-gray-200">({subject.progress}%)</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-1.5">
              <div
                className={`bg-gradient-to-r ${subject.color} h-1.5 rounded-full`}
                style={{ width: `${subject.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectProgress;
