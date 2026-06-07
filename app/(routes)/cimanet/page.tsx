'use client';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { NeedsBoard } from './NeedsBoard';
import { TalentGrid } from './TalentCard';
import { IdeaIncubator } from './IdeaIncubator';
import { HallOfFame } from './HallOfFame';
import { DNAExplorer } from './DNAExplorer';
import { FutureVision } from './FutureVision';
import { Footer } from './Footer';
import { History, Zap, Rocket, Fingerprint } from 'lucide-react';
import './styles.css'

export default function App() {
  const navItems = [
    { id: 'past', label: 'Past', icon: History },
    { id: 'dna', label: 'DNA', icon: Fingerprint },
    { id: 'present', label: 'Present', icon: Zap, active: true },
    { id: 'future', label: 'Future', icon: Rocket },
  ];

  return (
    // BỎ overflow-x-hidden ở đây để sticky hoạt động
    <div className="relative min-h-screen bg-surface text-zinc-100 selection:bg-accent selection:text-black">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>
      
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        
        {/* THANH NAV ĐÃ FIX: z-[100] và top-28 để nằm dưới Navbar */}
        <nav className="sticky top-20 md:top-24 z-[100] flex justify-center px-4 my-8 pointer-events-none">
          <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/20 p-1.5 flex gap-1 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-x-auto no-scrollbar max-w-full pointer-events-auto">
            {navItems.map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap
                  ${item.active 
                    ? 'bg-accent text-black font-black shadow-lg shadow-accent/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-[0.15em] font-black">{item.label}</span>
              </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-10 md:gap-16 pb-10">
          <section id="past" className="scroll-mt-40 container mx-auto px-6">
             <HallOfFame />
          </section>

          <section id="dna" className="scroll-mt-40 py-8 bg-zinc-900/40 border-y border-white/5">
            <div className="container mx-auto px-6">
              <DNAExplorer />
            </div>
          </section>

          <section id="present" className="scroll-mt-40 container mx-auto px-6 flex flex-col gap-10">
            <div className="grid gap-10">
                <NeedsBoard />
                <TalentGrid />
                <IdeaIncubator />
            </div>
          </section>

          <section id="future" className="scroll-mt-40 container mx-auto px-6">
            <FutureVision />
          </section>
        </div>

        {/* CTA Sáng rực rỡ */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto rounded-[3rem] bg-accent relative overflow-hidden px-8 py-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.3)]">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-black text-black mb-6 tracking-tighter leading-none">
                READY TO ROLL?
              </h2>
              <p className="text-lg md:text-xl text-black/80 mb-10 max-w-xl mx-auto font-bold">
                Join the future of cinematic collaboration.
              </p>
              <button className="px-12 py-6 bg-black text-white rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl">
                GET STARTED NOW
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}