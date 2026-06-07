"use client";

import React, { useEffect, useState } from 'react';
import { ReviewCard } from '@/components/Review/ReviewCard';
import { ConversationalInput } from '@/components/Dashboard/ConversationalInput';
import { FinancialGate } from '@/components/Financial/FinancialGate';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { Stars, Filter, CheckCircle2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  previousVersion?: { title: string, description: string };
}

export default function ReviewQueue() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [financialGate, setFinancialGate] = useState<{
    isOpen: boolean;
    type: 'subscription' | 'transfer' | 'authorization';
    amount: string;
    description: string;
    platform?: string;
    taskId?: string;
  }>({
    isOpen: false,
    type: 'subscription',
    amount: '',
    description: '',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/agent/tasks`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleApprove = async (id: string) => {
    const task = tasks.find(t => t.id === id);

    // Simulate a check for financial requirement
    if (
      task?.title.toLowerCase().includes('subscription') ||
      task?.title.toLowerCase().includes('buy') ||
      task?.title.toLowerCase().includes('listing fee') ||
      (task?.title.toLowerCase().includes('etsy') && task?.title.toLowerCase().includes('listing'))
    ) {
      setFinancialGate({
        isOpen: true,
        type: task.title.toLowerCase().includes('subscription') ? 'subscription' : 'authorization',
        amount: task.title.toLowerCase().includes('subscription') ? '$12.99' : '$0.20',
        description: `Approval for: ${task.title}`,
        platform: task.title.includes('Etsy') ? 'Etsy' : task.title.includes('Canva') ? 'Canva' : undefined,
        taskId: id
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/agent/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
        alert('Task approved and scheduled!');
      }
    } catch (error) {
      console.error('Error approving task:', error);
    }
  };

  const handleFinancialApprove = async () => {
    const id = financialGate.taskId;
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/api/agent/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
        setFinancialGate(prev => ({ ...prev, isOpen: false }));
        alert('Financial transaction approved and task scheduled!');
      }
    } catch (error) {
      console.error('Error approving financial task:', error);
    }
  };

  const handleRegenerate = async (id: string) => {
    alert('AI is regenerating this content...');
    // Implementation for regeneration would go here
  };

  const handleRefine = async (instruction: string) => {
    // Simulate AI refinement for demonstration
    setTasks(prev => prev.map(task => {
      if (task.id === '101') { // Target the Etsy listing for demo
        return {
          ...task,
          previousVersion: { title: task.title, description: task.description },
          title: `[Optimized] ${task.title}`,
          description: `${task.description}\n\nAI Optimization: Added trending keywords and improved readability based on your request: "${instruction}"`
        };
      }
      return task;
    }));
    alert(`AI has refined your content based on: "${instruction}". You can now compare versions.`);
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-4xl mx-auto">
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            Review Queue
          </h1>
          <div className="flex items-center gap-4 mt-2">
            {isLoading ? (
              <>
                <BrandedGlobe size="sm" animate={true} />
                <p className="text-muted-foreground font-medium text-sm md:text-base animate-pulse">
                  AI is preparing your strategy items...
                </p>
              </>
            ) : (
              <p className="text-muted-foreground font-medium text-sm md:text-base">
                AI has prepared {tasks.length} items for your review.
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-theme-surface border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-theme-background transition-colors text-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          {!isLoading && tasks.length > 0 && (
            <button className="flex-[2] md:flex-none bg-primary text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Approve All
            </button>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <ReviewCard
              key={task.id}
              id={task.id}
              platform={task.title.includes('Etsy') ? 'Etsy' : task.title.includes('TikTok') ? 'TikTok' : 'Instagram'}
              title={task.title}
              scheduledTime="Pending Review"
              description={task.description}
              previousVersion={task.previousVersion}
              onApprove={handleApprove}
              onRegenerate={handleRegenerate}
            />
          ))
        ) : !isLoading && (
          <div className="bg-theme-surface rounded-[48px] border-2 border-theme p-12 text-center space-y-6">
            <BrandedGlobe size="xl" className="mx-auto opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700" />
            <div className="space-y-2">
              <p className="text-muted-foreground italic text-lg font-bold">Your review queue is currently empty.</p>
              <p className="text-slate-500 text-xs uppercase font-black tracking-widest">The AI is working on new suggestions based on your goals.</p>
            </div>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex items-start gap-4">
            <div className="bg-primary p-2 rounded-xl text-slate-900">
              <Stars className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">AI Strategy Note</h4>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                I've prioritized these items based on current market trends and your active goals.
                Approving these will help maintain your growth momentum.
              </p>
            </div>
          </div>
        )}
      </div>

      <FinancialGate
        isOpen={financialGate.isOpen}
        onClose={() => setFinancialGate(prev => ({ ...prev, isOpen: false }))}
        onApprove={handleFinancialApprove}
        type={financialGate.type}
        amount={financialGate.amount}
        description={financialGate.description}
        platform={financialGate.platform}
      />

      <ConversationalInput
        onExecute={handleRefine}
        tip='Try saying "Make the description more playful"'
      />
    </div>
  );
}
