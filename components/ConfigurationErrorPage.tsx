import React from 'react';
import Icon from './Icon';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-black/30 text-cyan-300 p-3 rounded-md text-sm my-2 overflow-x-auto">
        <code>{children}</code>
    </pre>
);

const ConfigurationErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0d0c22] text-white p-4 md:p-6 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/20 rounded-full filter blur-3xl opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-400/20 rounded-full filter blur-3xl opacity-50"></div>
        </div>
        <div className="relative z-10 glass-card rounded-2xl p-8 md:p-12 w-full max-w-3xl text-center border-red-500/50 border">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-red-500/20 p-3 rounded-xl mb-4 border border-red-500/50">
                    <Icon name="database" className="w-10 h-10 text-red-400" />
                </div>
                <h1 className="text-3xl font-bold text-red-400">Action Required: Configuration Needed</h1>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                    Your application cannot connect to the database because it's missing the required credentials. Please follow the steps below to set it up.
                </p>
            </div>
            
            <div className="text-left bg-black/20 p-6 rounded-lg">
                <h2 className="font-semibold text-lg mb-4 text-white">How to Fix This:</h2>
                <ol className="list-decimal list-inside space-y-4 text-gray-300">
                    <li>
                        Open the following file in your code editor:
                        <CodeBlock>services/supabaseClient.ts</CodeBlock>
                    </li>
                    <li>
                        Go to your <a href="https://app.supabase.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline font-medium">Supabase Project Dashboard</a>.
                    </li>
                    <li>
                        Navigate to <span className="font-medium text-white">Project Settings &gt; API</span>.
                    </li>
                    <li>
                        Copy your <span className="font-medium text-white">Project URL</span> and <span className="font-medium text-white">anon public key</span>.
                    </li>
                    <li>
                        Paste these values into the `supabaseUrl` and `supabaseAnonKey` variables in the `services/supabaseClient.ts` file, replacing the placeholder text.
                    </li>
                </ol>
                 <p className="mt-6 text-sm text-gray-500">
                    Once you save the changes, the application should reload and work correctly. This is a one-time setup step.
                </p>
            </div>
        </div>
    </div>
  );
};

export default ConfigurationErrorPage;
