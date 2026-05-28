"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  X,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { approvalService, ApprovalRequest } from '@/lib/api-service';
import { BlueprintGate } from './Gates/BlueprintGate';
import { VisualDraftGate } from './Gates/VisualDraftGate';
import { GoLiveGate } from './Gates/GoLiveGate';
import { CreativeBlueprint } from './CreativeBlueprint';

export function ApprovalQueue() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState<ApprovalRequest | null>(null);
  const [showBlueprint, setShowBlueprint] = useState(false);

  useEffect(() => {
    async function loadRequests() {
      const data = await approvalService.getPendingRequests();
      setRequests(data);
      setLoading(false);
    }
    loadRequests();
  }, []);

  const handleDecision = async (id: string, status: 'approved' | 'rejected') => {
    await approvalService.respond(id, status);
    setRequests(prev => prev.filter(r => r.id !== id));
    setActiveRequest(null);
    setShowBlueprint(false);
  };

  if (loading) return null;
  if (requests.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
               <Bot className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-foreground tracking-tight uppercase italic">Strategic Approvals Pending.</h2>
         </div>
         <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
           {requests.length} Action{requests.length > 1 ? 's' : ''} Required
         </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <motion.button 
            key={req.id}
            onClick={() => setActiveRequest(req)}
            className="p-6 bg-theme-surface border-2 border-slate-50 rounded-[32px] hover:border-blue-600 transition-all text-left group shadow-sm"
            whileHover={{ y: -4 }}
          >
            <div className="flex justify-between items-start mb-6">
               <div className={cn(
                 "p-3 rounded-2xl",
                 req.type === 'blueprint' ? "bg-blue-50 text-blue-600" :
                 req.type === 'content' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
               )}>
                  {req.type === 'blueprint' ? <Zap className="w-5 h-5" /> : 
                   req.type === 'content' ? <ShieldCheck className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{req.type}</span>
            </div>
            
            <h4 className="font-bold text-foreground mb-2">
              {req.type === 'blueprint' ? 'Approve 30-Day Strategy' : 
               req.type === 'content' ? `Review ${req.payload?.platform ?? 'Draft'} Draft` : `Ready to Launch on ${req.payload?.platform ?? 'Platform'}`}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {req.type === 'blueprint' ? `Expansion plan for ${req.payload?.niche ?? 'your empire'}` :
               req.type === 'content' ? (req.payload?.title ?? 'Untitled Content') : `Final manifest for ${req.payload?.title ?? 'Production Item'}`}
            </p>
            
            <div className="mt-6 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:gap-3 transition-all">
               Review Request <Zap className="w-3 h-3 fill-current" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Decision Modal */}
      <AnimatePresence>
        {activeRequest && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setActiveRequest(null)}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
             />
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative w-full max-w-5xl bg-theme-surface rounded-[48px] shadow-2xl overflow-hidden"
             >
                <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto">
                   <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-slate-100 rounded-xl">
                            <Bot className="w-5 h-5 text-slate-400" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Empire Intelligence Gate</span>
                      </div>
                      <button 
                        onClick={() => setActiveRequest(null)}
                        className="p-3 hover:bg-slate-100 rounded-full transition-colors"
                      >
                         <X className="w-6 h-6 text-slate-400" />
                      </button>
                   </div>

                   {activeRequest.type === 'blueprint' && (
                     <BlueprintGate 
                       payload={activeRequest.payload} 
                       onApprove={(p) => handleDecision(activeRequest.id, 'approved')}
                       onReject={() => handleDecision(activeRequest.id, 'rejected')}
                     />
                   )}

                   {activeRequest.type === 'content' && (
                     showBlueprint ? (
                       <div className="space-y-6">
                         <button 
                           onClick={() => setShowBlueprint(false)}
                           className="flex items-center gap-2 text-slate-400 hover:text-foreground transition-colors font-bold text-sm uppercase tracking-widest mb-4"
                         >
                           <ChevronLeft className="w-4 h-4" />
                           Back to Draft
                         </button>
                         <CreativeBlueprint 
                           task={{
                             id: activeRequest.id,
                             title: activeRequest.payload.title,
                             platform: activeRequest.payload.platform,
                             status: 'editing',
                             dueDate: 'Today'
                           }} 
                           onClose={() => handleDecision(activeRequest.id, 'approved')} 
                         />
                       </div>
                     ) : (
                       <VisualDraftGate 
                         payload={activeRequest.payload}
                         onApprove={() => handleDecision(activeRequest.id, 'approved')}
                         onReject={() => handleDecision(activeRequest.id, 'rejected')}
                         onManualAssist={() => setShowBlueprint(true)}
                       />
                     )
                   )}

                   {activeRequest.type === 'golive' && (
                     <GoLiveGate 
                       payload={activeRequest.payload}
                       onApprove={() => handleDecision(activeRequest.id, 'approved')}
                       onReject={() => handleDecision(activeRequest.id, 'rejected')}
                     />
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
