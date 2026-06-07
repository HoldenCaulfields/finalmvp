import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, Users, DollarSign, Lightbulb, Camera, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

interface PostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'type' | 'details' | 'needs' | 'style';

export function PostProjectModal({ isOpen, onClose }: PostProjectModalProps) {
  const [step, setStep] = useState<Step>('type');
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    needs: [] as string[],
    style: '',
  });

  const steps: Step[] = ['type', 'details', 'needs', 'style'];
  const currentStepIndex = steps.indexOf(step);

  const nextStep = () => {
    const next = steps[currentStepIndex + 1];
    if (next) setStep(next);
  };

  const prevStep = () => {
    const prev = steps[currentStepIndex - 1];
    if (prev) setStep(prev);
  };

  const projectTypes = [
    { id: 'film', label: 'Short Film', icon: <Film className="w-6 h-6" /> },
    { id: 'youtube', label: 'YouTube Channel', icon: <Camera className="w-6 h-6" /> },
    { id: 'script', label: 'Script/Idea', icon: <Lightbulb className="w-6 h-6" /> },
    { id: 'music', label: 'Music Video', icon: <Users className="w-6 h-6" /> },
  ];

  const needsOptions = [
    { id: 'funding', label: 'Funding', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'crew', label: 'Crew Members', icon: <Users className="w-4 h-4" /> },
    { id: 'cast', label: 'Actors/Cast', icon: <Users className="w-4 h-4" /> },
    { id: 'equipment', label: 'Equipment', icon: <Camera className="w-4 h-4" /> },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl glass rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Post Your <span className="text-accent italic">Vision</span></h2>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Step {currentStepIndex + 1} of 4</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-white/5 w-full">
            <motion.div 
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 'type' && (
                <motion.div
                  key="type"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-medium">What are you building?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setFormData({ ...formData, type: type.id });
                          nextStep();
                        }}
                        className={cn(
                          "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group",
                          formData.type === type.id 
                            ? "border-accent bg-accent/10 text-accent" 
                            : "border-white/5 bg-white/5 hover:border-white/20"
                        )}
                      >
                        <div className="p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                          {type.icon}
                        </div>
                        <span className="font-bold">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-medium">Tell us about the project</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-2">Project Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Midnight in Saigon"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-2">Description</label>
                      <textarea 
                        rows={4}
                        placeholder="What is the story? What is the goal?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-accent transition-colors resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'needs' && (
                <motion.div
                  key="needs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-medium">What do you need right now?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {needsOptions.map((need) => (
                      <button
                        key={need.id}
                        onClick={() => {
                          const newNeeds = formData.needs.includes(need.id)
                            ? formData.needs.filter(n => n !== need.id)
                            : [...formData.needs, need.id];
                          setFormData({ ...formData, needs: newNeeds });
                        }}
                        className={cn(
                          "p-4 rounded-xl border transition-all flex items-center gap-3",
                          formData.needs.includes(need.id)
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded flex items-center justify-center border",
                          formData.needs.includes(need.id) ? "bg-accent border-accent text-black" : "border-white/20"
                        )}>
                          {formData.needs.includes(need.id) && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-sm font-medium">{need.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'style' && (
                <motion.div
                  key="style"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-medium">What's the cinematic vibe?</h3>
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-2">Style Influence</label>
                    <div className="flex flex-wrap gap-2">
                      {['David Fincher', 'Wes Anderson', 'Christopher Nolan', 'Tarantino', 'Neo-Noir', 'Documentary', 'Vlog'].map(s => (
                        <button
                          key={s}
                          onClick={() => setFormData({ ...formData, style: s })}
                          className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold transition-all",
                            formData.style === s ? "bg-accent text-black" : "glass hover:bg-white/10"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 p-6 rounded-2xl bg-accent/5 border border-accent/20">
                      <p className="text-sm text-accent/80 leading-relaxed italic">
                        "We'll use this to match you with creators who share your artistic DNA."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-white/10 flex items-center justify-between bg-white/5">
            <button
              onClick={prevStep}
              disabled={step === 'type'}
              className={cn(
                "flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-opacity",
                step === 'type' ? "opacity-0 pointer-events-none" : "opacity-60 hover:opacity-100"
              )}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            {step === 'style' ? (
              <button
                onClick={() => {
                  console.log('Project Submitted:', formData);
                  onClose();
                }}
                className="bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
              >
                Launch Vision <Rocket className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={step === 'type' && !formData.type}
                className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { Rocket } from 'lucide-react';
