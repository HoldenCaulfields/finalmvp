import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { DollarSign, Users, Camera, Lightbulb, AlertCircle, ArrowUpRight, Filter } from 'lucide-react';
import { cn } from '@/utils/cn';

type NeedType = 'funding' | 'crew' | 'cast' | 'equipment' | 'idea';

interface ProjectNeed {
  id: string;
  title: string;
  type: string;
  urgency: 'high' | 'medium' | 'low';
  need: NeedType;
  description: string;
  reward: string;
  author: string;
  avatar: string;
  tags: string[];
}

const NEEDS_DATA: ProjectNeed[] = [
  {
    id: '1',
    title: 'Neon Nights: Final Chase',
    type: 'Short Film',
    urgency: 'high',
    need: 'funding',
    description: 'We need $500 to rent a specialized anamorphic lens for our final night shoot this weekend.',
    reward: 'Executive Producer Credit + BTS Access',
    author: 'Hoang Film',
    avatar: 'https://picsum.photos/seed/h1/100/100',
    tags: ['Sci-fi', 'Action']
  },
  {
    id: '2',
    title: 'The Hidden Kitchen',
    type: 'YouTube Series',
    urgency: 'medium',
    need: 'crew',
    description: 'Looking for a dedicated Sound Recordist for a 3-day shoot in Da Lat. We have the gear, just need the ears!',
    reward: 'Paid + Travel Covered',
    author: 'FoodieVlog',
    avatar: 'https://picsum.photos/seed/f1/100/100',
    tags: ['Documentary', 'Food']
  },
  {
    id: '3',
    title: 'Untitled Horror Script',
    type: 'Feature Film',
    urgency: 'low',
    need: 'idea',
    description: 'Have a solid 1st act but stuck on the twist. Looking for a co-writer to brainstorm the finale.',
    reward: 'Co-writer Credit + Profit Share',
    author: 'DarkMind',
    avatar: 'https://picsum.photos/seed/d1/100/100',
    tags: ['Horror', 'Thriller']
  },
  {
    id: '4',
    title: 'Street Style 2026',
    type: 'Fashion Film',
    urgency: 'high',
    need: 'equipment',
    description: 'Our camera body just failed. Need a Sony FX3 or similar for tomorrow morning in District 1.',
    reward: 'Rental Fee + Future Collab',
    author: 'StyleStudio',
    avatar: 'https://picsum.photos/seed/s1/100/100',
    tags: ['Fashion', 'Commercial']
  }
];

const NEED_ICONS = {
  funding: <DollarSign className="w-4 h-4" />,
  crew: <Users className="w-4 h-4" />,
  cast: <Users className="w-4 h-4" />,
  equipment: <Camera className="w-4 h-4" />,
  idea: <Lightbulb className="w-4 h-4" />,
};

export function NeedsBoard() {
  const [filter, setFilter] = useState<NeedType | 'all'>('all');

  const filteredNeeds = filter === 'all' 
    ? NEEDS_DATA 
    : NEEDS_DATA.filter(n => n.need === filter);

  return (
    <section className="py-8 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <AlertCircle className="w-3 h-3" />
            Live Rescue Feed
          </div>
          <h2 className="text-5xl font-bold mb-4">THE <span className="text-accent italic">NEEDS</span> BOARD</h2>
          <p className="text-white/50 max-w-md">Real projects facing real obstacles. Be the missing piece that makes the vision happen.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'funding', 'crew', 'equipment', 'idea'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border",
                filter === f 
                  ? "bg-white text-black border-white" 
                  : "glass border-white/5 text-white/40 hover:border-white/20"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredNeeds.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass p-8 rounded-3xl relative group hover:bg-white/[0.07] transition-colors"
            >
              {/* Urgency Badge */}
              <div className="absolute top-6 right-8">
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter",
                  item.urgency === 'high' ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-white/40"
                )}>
                  {item.urgency === 'high' && <Zap className="w-2 h-2 fill-current" />}
                  {item.urgency} Urgency
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                  item.need === 'funding' ? "bg-green-500/20 text-green-500" :
                  item.need === 'crew' ? "bg-blue-500/20 text-blue-500" :
                  item.need === 'equipment' ? "bg-orange-500/20 text-orange-500" :
                  "bg-yellow-500/20 text-yellow-500"
                )}>
                  {NEED_ICONS[item.need]}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{item.type}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">{item.tags.join(' • ')}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">{item.title}</h3>
                  <p className="text-sm text-white/60 mb-6 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-6">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Reward / Offer</p>
                    <p className="text-xs font-medium text-accent">{item.reward}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                        <img src={item.avatar} alt={item.author} referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-xs font-medium text-white/40">@{item.author}</span>
                    </div>
                    <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-accent hover:text-black transition-all group/btn">
                      Rescue Project
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

import { Zap } from 'lucide-react';
