import { Film } from 'lucide-react';
import { YouTubeIcon, FacebookIcon, InstagramIcon } from "@/utils/icons";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-xl tracking-tighter">CIMANET</span>
            </div>
            <p className="text-white/40 max-w-sm mb-6">
              The world's first cinematic collaboration platform designed for the next generation of storytellers.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 glass rounded-full hover:text-accent transition-colors"><YouTubeIcon /* className="w-4 h-4" */ /></a>
              <a href="#" className="p-2 glass rounded-full hover:text-accent transition-colors"><InstagramIcon  /></a>
              <a href="#" className="p-2 glass rounded-full hover:text-accent transition-colors"><YouTubeIcon  /></a>
              <a href="#" className="p-2 glass rounded-full hover:text-accent transition-colors"><YouTubeIcon  /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-accent">Platform</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Browse Projects</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Find Talent</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Idea Incubator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-accent">Company</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/20">
          <p>© 2026 Cimanet Inc. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <span>Made with ❤️ for Creators</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
