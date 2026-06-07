import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { YouTubeIcon } from "@/utils/icons";

interface CompletedWork {
  id: string;
  title: string;
  director: string;
  image: string;
  link: string;
  type: 'youtube' | 'drive' | 'vimeo';
  year: string;
}

const COMPLETED_WORKS: CompletedWork[] = [
  {
    id: '1',
    title: 'The Silent Echo',
    director: 'Hoang Anh',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2059',
    link: 'https://youtube.com',
    type: 'youtube',
    year: '2025'
  },
  {
    id: '2',
    title: 'Neon Dreams',
    director: 'Minh Tu',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1025',
    link: 'https://drive.google.com',
    type: 'drive',
    year: '2024'
  },
  {
    id: '3',
    title: 'Urban Pulse',
    director: 'Linh Dan',
    image: 'https://images.unsplash.com/photo-1514516348920-f5d9278e812d?auto=format&fit=crop&q=80&w=1170',
    link: 'https://youtube.com',
    type: 'youtube',
    year: '2025'
  }
];

export function HallOfFame() {
  return (
    <section className="py-8 px-6 bg-black/40">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase mb-4 block">The Past</span>
          <h2 className="text-5xl font-bold mb-4">HALL OF <span className="text-accent">FAME</span></h2>
          <p className="text-white/40 max-w-xl">Real products created by SceneOne collaborators. From student shorts to viral YouTube series.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COMPLETED_WORKS.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-video rounded-xl overflow-hidden glass"
            >
              <img 
                src={work.image} 
                alt={work.title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{work.title}</h3>
                  <span className="text-[10px] font-mono text-white/40">{work.year}</span>
                </div>
                <p className="text-sm text-white/60 mb-4">Directed by {work.director}</p>
                
                <a 
                  href={work.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {work.type === 'youtube' ? <YouTubeIcon /* className="w-3 h-3" */ /> : <FileText className="w-3 h-3" />}
                  Watch Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
