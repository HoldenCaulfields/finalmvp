import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Fingerprint, Sparkles, Zap, Filter, Search } from 'lucide-react';
import { cn } from '@/utils/cn';

const DNA_TAGS = [
  { id: 'fincher', name: 'David Fincher', color: 'bg-blue-500', description: 'Precision, dark tones, psychological depth.' },
  { id: 'anderson', name: 'Wes Anderson', color: 'bg-yellow-500', description: 'Symmetry, pastel palettes, whimsical stories.' },
  { id: 'nolan', name: 'Christopher Nolan', color: 'bg-slate-500', description: 'Non-linear time, practical effects, grand scale.' },
  { id: 'tarantino', name: 'Quentin Tarantino', color: 'bg-red-500', description: 'Sharp dialogue, non-linear, stylized violence.' },
  { id: 'noir', name: 'Neo-Noir', color: 'bg-purple-500', description: 'Shadows, moral ambiguity, urban grit.' },
  { id: 'minimalist', name: 'Minimalist', color: 'bg-green-500', description: 'Less is more, quiet moments, visual breathing.' },
  { id: 'handheld', name: 'Handheld', category: 'Technique', color: 'bg-orange-500', description: 'Raw, documentary style, high energy.' },
];

const MOCK_MATCHES = [
  { id: 1, name: 'Alex Nguyen', role: 'DP', match: 98, tags: ['fincher', 'noir'], image: 'https://picsum.photos/seed/dp1/200/200' },
  { id: 2, name: 'Sarah Tran', role: 'Director', match: 92, tags: ['anderson', 'minimalist'], image: 'https://picsum.photos/seed/dir1/200/200' },
  { id: 3, name: 'Minh Le', role: 'Writer', match: 85, tags: ['nolan', 'noir'], image: 'https://picsum.photos/seed/writer1/200/200' },
];

export function DNAExplorer() {
  const [selectedDNA, setSelectedDNA] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const toggleDNA = (id: string) => {
    setSelectedDNA(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <section className="py-8 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar: DNA Selection */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-4">
              <Fingerprint className="w-3 h-3" />
              Artistic Identity
            </div>
            <h2 className="text-4xl font-bold mb-4">MAP YOUR <span className="text-accent italic">DNA</span></h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Select the cinematic influences and styles that define your vision. We'll find the creators who complete your sequence.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Select Influences</p>
            <div className="flex flex-wrap gap-2">
              {DNA_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleDNA(tag.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2",
                    selectedDNA.includes(tag.id)
                      ? "bg-accent text-black border-accent shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                      : "glass border-white/5 hover:border-white/20 text-white/60"
                  )}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full", tag.color)} />
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {selectedDNA.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-accent/5 border border-accent/20"
            >
              <div className="flex items-center gap-2 text-accent mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">DNA Analysis</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                You're building a vision rooted in {selectedDNA.map(id => DNA_TAGS.find(t => t.id === id)?.name).join(' & ')}. 
                We've found 12 creators with a 90%+ compatibility score.
              </p>
            </motion.div>
          )}
        </div>

        {/* Main: Results */}
        <div className="flex-1 relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
              >
                <div className="relative w-24 h-24 mb-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-accent/20 border-t-accent rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint className="w-8 h-8 text-accent animate-pulse" />
                  </div>
                </div>
                <p className="text-accent font-mono text-xs tracking-widest uppercase">Sequencing Creative DNA...</p>
              </motion.div>
            ) : selectedDNA.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 glass rounded-3xl border-dashed border-white/10"
              >
                <Search className="w-12 h-12 text-white/10 mb-6" />
                <h3 className="text-xl font-bold mb-2 text-white/40">Start Your Search</h3>
                <p className="text-sm text-white/20 max-w-xs">Select styles on the left to see creators who share your artistic vision.</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {MOCK_MATCHES.map((match, idx) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass p-6 rounded-3xl group hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent transition-colors">
                          <img src={match.image} alt={match.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-accent text-black text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-lg">
                          {match.match}%
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{match.name}</h4>
                        <p className="text-xs text-white/40 uppercase tracking-widest">{match.role}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {match.tags.map(tagId => {
                          const tag = DNA_TAGS.find(t => t.id === tagId);
                          return (
                            <div key={tagId} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                              <div className={cn("w-1 h-1 rounded-full", tag?.color)} />
                              <span className="text-[10px] font-medium text-white/60">{tag?.name}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">View Portfolio</button>
                        <button className="bg-white/10 hover:bg-accent hover:text-black p-2 rounded-lg transition-all">
                          <Zap className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
