import { motion } from 'framer-motion';
import { Rocket, Target, Film } from 'lucide-react';
import { YouTubeIcon } from "@/utils/icons";

const VISIONS = [
  {
    title: 'Build a 1M Sub YouTube Channel',
    category: 'Digital Content',
    icon: <YouTubeIcon /* className="w-5 h-5" */ />,
    progress: 15,
    description: 'Focusing on high-end cinematic travel vlogs across Southeast Asia.'
  },
  {
    title: 'Feature Film: "The Last Monsoon"',
    category: 'Cinema',
    icon: <Film className="w-5 h-5" />,
    progress: 5,
    description: 'A full-length theatrical release exploring family bonds in a changing climate.'
  },
  {
    title: 'Independent Animation Studio',
    category: 'Startup',
    icon: <Rocket className="w-5 h-5" />,
    progress: 40,
    description: 'Creating a collective for 2D animators to produce original IP.'
  }
];

export function FutureVision() {
  return (
    <section className="py-8 px-6 bg-surface-muted">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase mb-4 block">The Future</span>
          <h2 className="text-5xl font-bold mb-4">VISION <span className="text-accent italic">BOARD</span></h2>
          <p className="text-white/40 max-w-2xl mx-auto">Long-term goals and ambitious projects that are currently in the "dreaming & planning" phase.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {VISIONS.map((vision, index) => (
            <motion.div
              key={vision.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-24 h-24" />
              </div>
              
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent">
                {vision.icon}
              </div>
              
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent/60 mb-2 block">{vision.category}</span>
              <h3 className="text-2xl font-bold mb-4">{vision.title}</h3>
              <p className="text-sm text-white/50 mb-8 leading-relaxed">{vision.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-white/40">Readiness</span>
                  <span className="text-accent">{vision.progress}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${vision.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>

              <button className="mt-8 w-full py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                Join the Vision
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
