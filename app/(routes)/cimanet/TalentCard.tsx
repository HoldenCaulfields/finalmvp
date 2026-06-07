import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';

interface Talent {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  projects: number;
}

const TALENTS: Talent[] = [
  {
    id: '1',
    name: 'Alex Nguyen',
    role: 'Director of Photography',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=687',
    rating: 4.9,
    projects: 24
  },
  {
    id: '2',
    name: 'Sarah Tran',
    role: 'Lead Actress',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=687',
    rating: 5.0,
    projects: 12
  },
  {
    id: '3',
    name: 'Minh Le',
    role: 'Screenwriter',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=687',
    rating: 4.8,
    projects: 31
  },
  {
    id: '4',
    name: 'Elena Pham',
    role: 'Colorist',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=764',
    rating: 4.7,
    projects: 18
  }
];

export function TalentGrid() {
  return (
    <section className="py-8 bg-surface-muted px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">Featured <span className="text-accent">Talent</span></h2>
            <p className="text-white/50">The best creators in the industry, ready for your next project.</p>
          </div>
          <button className="text-accent font-bold hover:underline">Browse All Talent</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TALENTS.map((talent, index) => (
            <motion.div
              key={talent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative aspect-square rounded-full overflow-hidden mb-6 border-2 border-white/5 group-hover:border-accent transition-colors">
                <img 
                  src={talent.image} 
                  alt={talent.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-lg mb-1">{talent.name}</h3>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">{talent.role}</p>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-3 h-3 fill-current" />
                    {talent.rating}
                  </div>
                  <div className="text-white/30">
                    {talent.projects} Projects
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
