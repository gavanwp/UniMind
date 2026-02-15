
import React from 'react';
import Icon from './Icon';
import SubjectProgress from './SubjectProgress';

const menuItems = [
  { name: 'Dashboard', icon: 'dashboard' },
  { name: 'Upload Notes', icon: 'upload' },
  { name: 'MCQ Generator', icon: 'mcq' },
  { name: 'Viva Mode', icon: 'viva' },
  { name: 'Code Assistant', icon: 'code' },
  { name: 'Study Planner', icon: 'planner' },
  { name: 'Profile', icon: 'profile' },
];

type SidebarProps = {
  onNavigate: (page: string) => void;
  currentPage: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage, isMobileMenuOpen, setIsMobileMenuOpen }) => {

  const pageToNameMap: { [key: string]: string } = {
    Dashboard: 'Dashboard',
    UploadNotes: 'Upload Notes',
    MCQGenerator: 'MCQ Generator',
    VivaMode: 'Viva Mode',
    CodeAssistant: 'Code Assistant',
    StudyPlanner: 'Study Planner',
    Profile: 'Profile',
  };

  const activeItem = pageToNameMap[currentPage] || 'Dashboard';

  const SidebarContent = () => (
     <div className="p-6 h-full flex flex-col glass-card lg:rounded-2xl w-64 lg:w-full">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-cyan-400 p-2 rounded-lg">
              <Icon name="logo" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">UniMind AI</h1>
              <p className="text-xs text-gray-400">Pakistan's Smart Academic Assistant</p>
            </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <Icon name="x" className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-grow">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <a
                href="#"
                onClick={() => onNavigate(item.name)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeItem === item.name
                    ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon name={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6">
        <SubjectProgress />
      </div>
    </div>
  );


  return (
    <>
        {/* Mobile Sidebar */}
        <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <SidebarContent />
        </div>
         {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}


        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:col-span-2">
            <SidebarContent />
        </div>
    </>
  );
};

export default Sidebar;
