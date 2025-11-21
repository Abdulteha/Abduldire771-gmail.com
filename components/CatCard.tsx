import React from 'react';
import { CatData } from '../types';
import { Download, Share2 } from 'lucide-react';

interface CatCardProps {
  cat: CatData;
}

export const CatCard: React.FC<CatCardProps> = ({ cat }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = cat.imageUrl;
    link.download = `cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700 transition-transform hover:scale-[1.02] duration-300 flex flex-col h-full">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
        <img 
          src={cat.imageUrl} 
          alt={`A generated picture of ${cat.name}`} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-0 right-0 p-2 bg-gradient-to-l from-black/50 to-transparent">
          <button 
            onClick={handleDownload}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-white transition-colors"
            title="Download Photo"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
        <p className="text-slate-300 text-sm flex-grow leading-relaxed">
          {cat.description}
        </p>
        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
          <span>Generated with Gemini</span>
          <span>{new Date(cat.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
