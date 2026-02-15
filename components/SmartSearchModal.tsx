import React from 'react';
import Icon from './Icon';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  response: string;
  isLoading: boolean;
}

const SmartSearchModal: React.FC<SmartSearchModalProps> = ({ isOpen, onClose, query, response, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-6 md:p-8 w-full max-w-2xl border border-white/20 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Icon name="spark" className="w-6 h-6 text-purple-400" />
                Smart Search Result
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <Icon name="x-circle" className="w-7 h-7" />
            </button>
        </div>

        <div className="bg-black/20 p-3 rounded-lg mb-4 flex-shrink-0">
            <p className="text-sm text-gray-300">Your query: <span className="font-semibold text-white">"{query}"</span></p>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="flex items-center gap-3 text-gray-300">
                        <Icon name="logo" className="w-8 h-8 text-purple-500 animate-spin" />
                        <span className="text-lg">Searching...</span>
                    </div>
                </div>
            ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                        children={response || ''}
                        components={{ code: CodeBlock }}
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SmartSearchModal;