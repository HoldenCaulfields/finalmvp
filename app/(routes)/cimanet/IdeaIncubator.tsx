import { motion } from 'framer-motion';
import { Lightbulb, MessageSquare, Share2 } from 'lucide-react';

const IDEAS = [
  {
    id: '1',
    title: 'A story about a man who can only speak in movie quotes.',
    author: 'IdeaBot',
    likes: 124,
    comments: 12
  },
  {
    id: '2',
    title: 'Sci-fi short: A world where memories are traded like cryptocurrency.',
    author: 'NeoWriter',
    likes: 89,
    comments: 45
  },
  {
    id: '3',
    title: 'YouTube Channel Idea: Reviewing street food from the year 2050.',
    author: 'FutureEats',
    likes: 256,
    comments: 32
  }
];

export function IdeaIncubator() {
  return (
    <section className="py-8 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-6">
            <Lightbulb className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight">THE IDEA <span className="text-accent italic">INCUBATOR</span></h2>
          <p className="text-white/50 text-lg mb-8 max-w-md">
            Don't have a crew yet? Start with an idea. Pitch your concepts, get feedback, and find your first collaborator.
          </p>
          <button className="px-8 py-4 glass rounded-full font-bold hover:bg-white/10 transition-colors">
            Pitch an Idea
          </button>
        </div>

        <div className="flex-1 relative">
          <div className="space-y-6">
            {IDEAS.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass p-6 rounded-2xl relative group hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xl font-medium mb-4 leading-snug">"{idea.title}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40 font-mono">@{idea.author}</span>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {idea.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      {idea.likes}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Decorative Blur */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
        </div>
      </div>
    </section>
  );
}
