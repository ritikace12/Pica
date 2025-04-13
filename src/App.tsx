import React, { useState } from 'react';
import { Send,  Loader2, Globe, Terminal, Brain } from 'lucide-react';
import { AIAgent } from './lib/ai-agent';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const aiAgent = new AIAgent(
    import.meta.env.VITE_GEMINI_API_KEY,
    import.meta.env.VITE_PICA_API_KEY
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await aiAgent.processUserInput(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const featuredSections = [
    {
      id: 'chat',
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Chat',
      description: 'Engage in intelligent conversations'
    },
    {
      id: 'tools',
      icon: <Terminal className="w-6 h-6" />,
      title: 'Smart Tools',
      description: 'Access powerful AI-powered tools'
    },
    {
      id: 'explore',
      icon: <Globe className="w-6 h-6" />,
      title: 'Explore',
      description: 'Discover AI capabilities'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex flex-col">
      <header className="bg-black/30 backdrop-blur-lg border-b border-gray-700/30 py-6">
        <div className="max-w-6xl mx-auto px-4">

              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                JARVIS 
              </h1>
    
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <div className="flex justify-center gap-6 mb-8">
          {featuredSections.map(section => (
            <div
              key={section.id}
              className="w-64 p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-lg bg-gray-700/50 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-100">{section.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{section.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[500px] max-h-[600px]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-100'
                      : 'bg-gray-700/50 border border-gray-600/30 text-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600/30">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-700/50 p-4 bg-gray-800/30">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-gray-600/50 bg-gray-700/30 px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-3 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 transition-all duration-300"
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-black/30 backdrop-blur-lg border-b border-gray-700/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                Powered by Portgas U!
              </h1>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;


