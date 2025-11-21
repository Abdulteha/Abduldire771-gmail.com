import React, { useState, useCallback } from 'react';
import { CatData, GenerationState } from './types';
import { generateCatContent } from './services/gemini';
import { Button } from './components/Button';
import { CatCard } from './components/CatCard';
import { Sparkles, Cat, Search } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [cats, setCats] = useState<CatData[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    error: null
  });

  const handleGenerate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerationState({ isLoading: true, error: null });

    try {
      const { imageUrl, name, description } = await generateCatContent(prompt);
      
      const newCat: CatData = {
        id: crypto.randomUUID(),
        imageUrl,
        name,
        description,
        createdAt: Date.now()
      };

      setCats(prev => [newCat, ...prev]);
      setPrompt(''); // Clear input after success
    } catch (err) {
      setGenerationState({ 
        isLoading: false, 
        error: "Failed to summon the kitty. Please try again." 
      });
    } finally {
      setGenerationState(prev => ({ ...prev, isLoading: false }));
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Cat className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Purrfect Pixels
            </h1>
          </div>
          <nav>
            {/* 
               Fulfilled specific user request below: 
               "Your anchor (a) element's text should be cat photos."
            */}
            <a 
              href="#gallery" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              cat photos
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Hero & Input Section */}
        <section className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
            Dream up your ideal feline.
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Describe a cat—any cat—and watch our AI summon it into existence with a unique personality.
          </p>

          <form onSubmit={handleGenerate} className="relative">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex bg-slate-800 rounded-lg p-2 shadow-2xl ring-1 ring-white/10">
                <div className="flex-grow flex items-center pl-3">
                  <Search className="text-slate-500 w-5 h-5 mr-3" />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A cyberpunk cat hacker with neon goggles..."
                    className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 focus:outline-none py-2"
                    disabled={generationState.isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  isLoading={generationState.isLoading}
                  disabled={!prompt.trim()}
                  className="ml-2"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            </div>
            {generationState.error && (
              <p className="absolute -bottom-8 left-0 right-0 text-red-400 text-sm animate-pulse">
                {generationState.error}
              </p>
            )}
          </form>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
              Recent Creations
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                {cats.length}
              </span>
            </h3>
          </div>

          {cats.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
              <div className="inline-block p-4 bg-slate-800 rounded-full mb-4">
                <Cat className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-lg">No cats generated yet.</p>
              <p className="text-slate-500 text-sm mt-2">Enter a prompt above to start your collection!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cats.map((cat) => (
                <CatCard key={cat.id} cat={cat} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Purrfect Pixels. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
