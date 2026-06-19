"use client";

import React, { useEffect, useState } from 'react';
import { ReviewCard } from '@/components/Review/ReviewCard';
import { ConversationalInput } from '@/components/Dashboard/ConversationalInput';
import { FinancialGate } from '@/components/Financial/FinancialGate';
import { NeuralDispatchCenter } from '@/components/Dashboard/NeuralDispatchCenter';
import { BrandedGlobe } from '@/components/BrandedGlobe';
import { Stars, Filter, CheckCircle2, LayoutGrid, List } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'dispatch' | 'classic'>('dispatch');
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
      }
    } catch (error) {
      console.error('Error approving financial task:', error);
    }
  };

  const handleRegenerate = async (id: string) => {
    // Implementation for regeneration
  };

  const handleRefine = async (instruction: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === '101') {
        return {
          ...task,
          previousVersion: { title: task.title, description: task.description },
          title: `[Optimized] ${task.title}`,
          description: `${task.description}\n\nAI Optimization: Added trending keywords and improved readability based on your request: "${instruction}"`
        };
      }
      return task;
    }));
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter italic">
              Neural Dispatch Center
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium italic mt-1">
            Review, refine, and dispatch AI-generated content to your connected platforms.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 p-1 bg-theme-background border border-theme rounded-2xl">
          <button
            onClick={() => setViewMode('dispatch')}
            className={cn(
              'px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-1.5',
              viewMode === 'dispatch'
                ? 'bg-primary text-slate-950 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Dispatch Hub
          </button>
          <button
            onClick={() => setViewMode('classic')}
            className={cn(
              'px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-1.5',
              viewMode === 'classic'
                ? 'bg-primary text-slate-950 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <List className="w-3.5 h-3.5" />
            Classic Review
          </button>
        </div>
      </header>

      {/* Neural Dispatch Center */}
      {viewMode === 'dispatch' && (
        <NeuralDispatchCenter />
      )}

      {/* Classic Review Mode */}
      {viewMode === 'classic' && (
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
        </div>
      )}

      {/* Financial Gate */}
      <FinancialGate
        isOpen={financialGate.isOpen}
        onClose={() => setFinancialGate(prev => ({ ...prev, isOpen: false }))}
        onApprove={handleFinancialApprove}
        type={financialGate.type}
        amount={financialGate.amount}
        description={financialGate.description}
        platform={financialGate.platform}
      />

      {/* Conversational Input - only in classic mode */}
      {viewMode === 'classic' && (
        <ConversationalInput
          onExecute={handleRefine}
          tip='Try saying "Make the description more playful"'
        />
      )}
    </div>
  );
}