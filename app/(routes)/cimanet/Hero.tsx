import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen z-3000 flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Video/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059" 
          alt="Cinematic Background" 
          className="w-full h-full object-cover opacity-40 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/80 to-surface" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-accent text-xs font-bold tracking-widest uppercase mb-6">
            The Future of Filmmaking
          </span>
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-[0.9] mb-8 tracking-tighter">
            WHERE <span className="text-accent italic">VISION</span><br />
            MEETS REALITY
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Cimanet is the premier platform for directors to find actors, writers to find producers, and creators to build the next cinematic masterpiece.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform group">
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 glass rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
              <Play className="w-5 h-5 fill-current" />
              Watch Reel
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
