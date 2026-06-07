import { motion } from 'framer-motion';
import { Fingerprint, Zap, Heart, Camera } from 'lucide-react';

const STYLES = [
  { name: 'David Fincher', category: 'Director', color: 'bg-blue-500' },
  { name: 'Wes Anderson', category: 'Aesthetic', color: 'bg-yellow-500' },
  { name: 'Neo-Noir', category: 'Genre', color: 'bg-purple-500' },
  { name: 'Handheld', category: 'Technique', color: 'bg-red-500' },
  { name: 'Minimalist', category: 'Storytelling', color: 'bg-green-500' },
  { name: 'Christopher Nolan', category: 'Director', color: 'bg-slate-500' },
];

export function StylePulse() {
  return (
    <section className="py-24 px-6 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-6">
            <Fingerprint className="w-3 h-3" />
            Style DNA Matching
          </div>
          <h2 className="text-5xl font-bold mb-8 leading-tight">FIND YOUR <span className="text-accent italic">CREATIVE PULSE</span></h2>
          <p className="text-white/50 text-lg mb-10 leading-relaxed">
            Don't just find a crew. Find your artistic soulmates. We match you based on your cinematic influences, preferred techniques, and storytelling philosophy.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-6 rounded-2xl">
              <Zap className="w-6 h-6 text-accent mb-4" />
              <h4 className="font-bold mb-2">Influence Match</h4>
              <p className="text-xs text-white/40">Connect with those who share your love for Fincher's precision or Tarantino's dialogue.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <Heart className="w-6 h-6 text-pink-500 mb-4" />
              <h4 className="font-bold mb-2">Genre Synergy</h4>
              <p className="text-xs text-white/40">Whether it's gritty horror or whimsical romance, find people who "get" the vibe.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Visual DNA Map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-64 h-64 rounded-full bg-accent/20 blur-3xl"
              />
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {STYLES.map((style, index) => (
                <motion.div
                  key={style.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-4 rounded-xl flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${style.color} mb-3 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                  <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{style.category}</span>
                  <span className="font-bold text-sm group-hover:text-accent transition-colors">{style.name}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Floating Connection Lines (Visual Decor) */}
            <svg className="absolute inset-0 w-full h-full -z-10 opacity-20" viewBox="0 0 400 400">
              <motion.path 
                d="M100,100 L300,300 M300,100 L100,300" 
                stroke="currentColor" 
                strokeWidth="1" 
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
