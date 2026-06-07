import { Film, Search, Plus, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { PostProjectModal } from './PostProjectModal';

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-full px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display font-bold text-xl tracking-tighter">CIMANET</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#" className="hover:text-accent transition-colors">Projects</a>
            <a href="#" className="hover:text-accent transition-colors">Talent</a>
            <a href="#" className="hover:text-accent transition-colors">Incubator</a>
            <a href="#" className="hover:text-accent transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" />
              <span>Post Project</span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden hidden sm:block">
              <img src="https://picsum.photos/seed/user1/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </nav>

      <PostProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
