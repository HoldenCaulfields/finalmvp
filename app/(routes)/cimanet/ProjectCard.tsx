import { motion } from 'framer-motion';
import { Users, Clock, MapPin } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  type: string;
  genre: string;
  image: string;
  roles: string[];
  location: string;
  status: string;
}

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Midnight in Saigon',
    type: 'Short Film',
    genre: 'Neo-Noir',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1025',
    roles: ['Cinematographer', 'Lead Actor'],
    location: 'Ho Chi Minh City',
    status: 'Pre-production'
  },
  {
    id: '2',
    title: 'The Last Frame',
    type: 'Documentary',
    genre: 'Biographical',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1171',
    roles: ['Editor', 'Sound Designer'],
    location: 'Remote / Hanoi',
    status: 'Post-production'
  },
  {
    id: '3',
    title: 'Cyber Street Food',
    type: 'YouTube Series',
    genre: 'Travel / Tech',
    image: 'https://images.unsplash.com/photo-1514516348920-f5d9278e812d?auto=format&fit=crop&q=80&w=1170',
    roles: ['Host', 'Motion Designer'],
    location: 'Da Nang',
    status: 'Casting'
  }
];

export function ProjectFeed() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase mb-4 block">The Present</span>
          <h2 className="text-5xl font-bold mb-4">ACTIVE <span className="text-accent">COLLABS</span></h2>
          <p className="text-white/50">Projects in motion looking for missing pieces. Help them cross the finish line.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 glass rounded-full text-xs font-bold hover:bg-white/10 transition-colors">Filter by Needs</button>
          <button className="text-accent font-bold hover:underline text-sm">View All</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-wider self-start">
                  {project.type}
                </span>
                {/* Visual Needs Tags */}
                <div className="flex gap-1">
                  {index === 0 && <span className="px-2 py-0.5 bg-red-500/80 text-[8px] font-bold uppercase rounded">Needs Funding</span>}
                  {index === 1 && <span className="px-2 py-0.5 bg-blue-500/80 text-[8px] font-bold uppercase rounded">Needs Editor</span>}
                  {index === 2 && <span className="px-2 py-0.5 bg-yellow-500/80 text-[8px] font-bold uppercase rounded">Needs Script</span>}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">{project.genre}</p>
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                
                <div className="flex flex-wrap gap-2">
                  {project.roles.map(role => (
                    <span key={role} className="text-[10px] bg-white/10 px-2 py-1 rounded-md border border-white/10">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* ... rest of the card ... */}

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4 text-xs text-white/40">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {project.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {project.status}
                </div>
              </div>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-surface overflow-hidden">
                    <img src={`https://picsum.photos/seed/crew${i}/50/50`} alt="Crew" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
