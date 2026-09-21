"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, User, Bot, Loader2, Wand2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '@/lib/config';

const getAuthHeader = (): string => {
  if (typeof window !== 'undefined') {
    let token = localStorage.getItem('empire_auth_token');
    if (!token) { token = crypto.randomUUID(); localStorage.setItem('empire_auth_token', token); }
    return `Bearer ${token}`;
  }
  return 'Bearer ';
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Known platform names the client might relay (owner: every component relayed
// in the conversation must land in the video). Used by the deterministic
// relayed-components extractor below.
const PLATFORM_NAMES = [
  'etsy', 'shopify', 'tiktok', 'instagram', 'youtube', 'amazon', 'ebay',
  'squarespace', 'wix', 'gumroad', 'patreon', 'linkedin', 'twitch',
];

// Known color keywords (style/mood components a client typically names).
const COLOR_NAMES = [
  'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'gold',
  'silver', 'black', 'white', 'teal', 'navy', 'coral', 'lavender', 'beige',
  'cream', 'brown', 'emerald', 'violet', 'pastel', 'neon',
];

// Every concrete component the client can relay — used to decide the
// "signal" sentences that count as components (vs conversational filler).
const COMPONENT_SIGNAL = /(brand|shop|store|business|company|product|color|colour|palette|platform|price|pricing|offer|deal|discount|cta|call to action|style|mood|vibe|theme|niche|audience|target|hook|background|effect|transition|sparkle|glow|neon|aesthetic|vintage|minimal|modern)/i;

// Explicit "label: value" relays (e.g. "Colors: purple and gold").
const COMPONENT_LABEL = /^\s*(?:brand|shop|store|business|company|product|color|colour|colors|colours|palette|platform|price|pricing|offer|deal|cta|call\s*to\s*action|style|mood|vibe|theme|niche|audience|target\s*(?:audience|customer)?|hook|name)\s*[:：\-–]\s*(.+)$/i;

const CONVERSATIONAL_FILLER = /^(ok(ay)?|sure|yes|yeah|great|perfect|awesome|nice|love|please|added|got it|sounds good|i'd love|i want|i need|let'?s|so|and|also|basically|anyway)\b/i;

const isConcreteSentence = (s: string): boolean => {
  const trimmed = s.trim();
  const words = trimmed.split(/\s+/);
  return words.length >= 2 && /[a-zA-Z]/.test(trimmed) && !/\?/.test(trimmed);
};

// Strip a leading conversational filler word so "And the CTA is…" still yields
// the CTA component (owner: relayed components must land in the video).
const stripLeadingFiller = (raw: string): string => raw.replace(CONVERSATIONAL_FILLER, ' ').trim();

/** Deterministic, pure extraction of the concrete components the client
 *  relayed in the consultant conversation. Only USER turns count — assistant /
 *  consultant framing can never carry client components. Returns de-duplicated
 *  (case-insensitive) concrete fragments: brand/shop/product names, colors,
 *  platform names, features/benefits, offers/prices, CTA wording, style/mood.
 *  Capped at 14 so the backend planner inventory stays manageable. */
export function extractRelayedComponentsFromConversation(
  messages: Array<{ role: string; content: string }>
): string[] {
  const results: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string) => {
    const v = raw.replace(/\s+/g, ' ').trim();
    if (!v || v.length > 80) return;
    const key = v.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    results.push(v);
  };

  for (const msg of messages) {
    if (msg.role !== 'user' || !msg.content) continue;
    const lines = msg.content.split(/\n+/);
    for (const line of lines) {
      const raw = line.trim();
      if (!raw) continue;
      // Bullet/list entries — each is a concrete component.
      const bullet = raw.match(/^\s*[-–—•*+]\s+(.+)$/);
      if (bullet) { push(bullet[1]); continue; }
      // Explicit "label: value" relays (brand, colors, platform, price, CTA…).
      const labeled = raw.match(COMPONENT_LABEL);
      if (labeled) { push(labeled[1]); continue; }
      // Prose: split on sentence boundaries AND commas/semicolons so a long
      // line still yields its CTA/price/style fragments.
      const fragments = raw
        .split(/(?<=[.!?])\s+|[;,]/)
        .map(f => stripLeadingFiller(f))
        .filter(Boolean);
      for (const fragment of fragments) {
        if (!isConcreteSentence(fragment)) continue;
        if (COMPONENT_SIGNAL.test(fragment)) push(fragment);
      }
      // Also surface bare color/platform mentions even when prose is long.
      const lower = raw.toLowerCase();
      for (const p of PLATFORM_NAMES) if (lower.includes(p)) push(p);
      for (const c of COLOR_NAMES) if (lower.includes(c)) push(c);
    }
  }
  return results.slice(0, 14);
}

interface InlineConsultantProps {
  context: 'video' | 'editor' | 'faceless' | 'design' | 'neural-twin';
  initialMessage?: string;
  className?: string;
  idea?: string;
  onGenerate?: (finalIdea: string) => void;
  isParentGenerating?: boolean;
  empireContext?: { niche?: string; angle?: string; targetCustomers?: string; businessGoals?: string };
  /** UI-set controls the user has already chosen (duration/voice/tone). These are
   *  fed to the router as "SETTLED — do not re-ask" so the consultant never
   *  re-asks for them mid-session, and the backend persists them as locked facts. */
  settledSettings?: { duration?: string; voice?: string | 'auto'; tone?: string | 'auto' };
  /** When true, hide the wand button in this consultant instance (used by the
   *  unified Customize flow where a parent "Launch Project" button triggers the
   *  generation instead). */
  suppressWand?: boolean;
  /** When true, the consultant is in a post-submit "working on it" state: the
   *  refine hint bar and refine-flavored placeholder are suppressed so a
   *  just-submitted generation is never invited to be refined mid-flight
   *  (owner: a refinement is another paid generation — no wire to spend more
   *  outside an explicit NEW request). The input stays active; a new user
   *  message is a new request, and the parent releases this flag then. */
  submitted?: boolean;
  /** Called with the current refined idea (conversation summary) whenever the
   *  conversation updates, so a parent "Launch Project" button can submit the
   *  refined idea through the scene engine. */
  onRefinedIdea?: (idea: string) => void;
  /** Called with the FULL conversation (role + content) whenever it updates,
   *  so a Scene-Based launch payload can send the whole conversation to the
   *  backend planner (owner: GPT must read the entire conversation, not just a
   *  compressed summary). */
  onConversation?: (messages: Array<{ role: string; content: string }>) => void;
  /** Called with the de-duplicated concrete components the client relayed in
   *  the conversation (USER turns only), so the backend planner guarantees
   *  every one of them appears in the final video. */
  onRelayedComponents?: (components: string[]) => void;
  /** Closing-line hint forwarded to the consult router (mode:'consult') when
   *  this consultant replaces the wand with a parent "Launch Project" button
   *  (suppressWand). Backend consultGenerateReply(actionHint) uses it so the
   *  AI's closing line names the REAL button instead of the vanished wand.
   *  ONLY set on the Scene-Based suppressWand flow — other flows keep the
   *  wand copy by omitting it. */
  actionHint?: string;
}

export function InlineConsultant({ context, initialMessage, className, idea, onGenerate, isParentGenerating, empireContext, settledSettings, suppressWand, submitted, onRefinedIdea, onConversation, onRelayedComponents, actionHint }: InlineConsultantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastIdea, setLastIdea] = useState('');
  const [readyToGenerate, setReadyToGenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Build the list of UI-settled facts (duration / voice / tone) the user has
  // already chosen via controls. Fed into the consult context so the router
  // treats them as confirmed and does NOT re-ask mid-session. 'auto' values are
  // treated as "not yet decided" and skipped.
  const settledFacts = (): string[] => {
    if (!settledSettings) return [];
    const facts: string[] = [];
    if (settledSettings.duration) facts.push(`duration: ${settledSettings.duration} seconds`);
    if (settledSettings.voice && settledSettings.voice !== 'auto') facts.push(`voice: ${settledSettings.voice}`);
    if (settledSettings.tone && settledSettings.tone !== 'auto') facts.push(`tone: ${settledSettings.tone}`);
    return facts;
  };
  const settledBlock = (): string => {
    const facts = settledFacts();
    return facts.length ? `\n[SETTLED — the user has already chosen these in the UI, do NOT re-ask about them: ${facts.join(', ')}]` : '';
  };

  // Reset local generating state when parent's pipeline finishes
  const prevParentGenerating = useRef(isParentGenerating);
  useEffect(() => {
    if (prevParentGenerating.current && !isParentGenerating) {
      setIsGenerating(false);
    }
    prevParentGenerating.current = isParentGenerating;
  }, [isParentGenerating]);

  useEffect(() => {
    if (initialMessage) {
      setMessages([{ role: 'assistant', content: initialMessage }]);
    } else {
      // Default initial messages based on context
      const defaults: Record<string, string> = {
        video: "Let's design your video together. What visuals are you imagining? Tell me about backgrounds, effects (sparkles, transitions, overlays), color schemes, and any specific elements you want. I'll refine the script around your vision.",
        editor: "Upload your clips and tell me how you want it to look. Any specific background style, effects, or on-screen graphics? Should I prioritize fast cuts or cinematic transitions?",
        faceless: "What niche should we dominate? Describe the vibe — backgrounds, motion graphics, overlays, text styles. I'll pull trending footage and build the visuals around your preferences.",
        design: "Describe your product vision in detail — colors, materials, backgrounds, sparkles or effects, layout style. I'll cross-reference it with current market-winning DNA and suggest refinements.",
        'neural-twin': "Once your photo is uploaded, I can script your twin. What's the main goal? Also, what background setting, effects, or visual style do you want for the video?"
      };
      setMessages([{ role: 'assistant', content: defaults[context] || defaults.video }]);
    }
  }, [context, initialMessage]);

  // When a new idea is shared from the parent (Enter pressed in textarea), send it to the AI
  useEffect(() => {
    if (idea && idea !== lastIdea && idea.trim()) {
      setLastIdea(idea);
      
      // Auto-send the idea to the AI consultant for review
      const sendIdeaToConsultant = async () => {
        setMessages(prev => [...prev, { role: 'user', content: `Here's my video idea: ${idea}` }]);
        setIsTyping(true);
        
        try {
          const userId = typeof window !== 'undefined' ? localStorage.getItem('empire_userId') : null;
          const brandId = typeof window !== 'undefined' ? localStorage.getItem('empire_brandId') : null;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);
          const response = await fetch(`${API_URL}/api/studio/process`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': getAuthHeader(),
              ...(userId ? { 'x-user-id': userId } : {})
            },
            body: JSON.stringify({
              request: `My video idea: ${idea}${settledBlock()}`,
              brandId: brandId || undefined,
              conversationHistory: [
                ...(settledFacts().length ? [{ role: 'assistant' as const, content: `SETTLED — user already chose: ${settledFacts().join(', ')} (do not re-ask)` }] : []),
                { role: 'user' as const, content: `My video idea: ${idea}` }
              ],
              voice: settledSettings?.voice && settledSettings.voice !== 'auto' ? settledSettings.voice : undefined,
              tone: settledSettings?.tone && settledSettings.tone !== 'auto' ? settledSettings.tone : undefined,
              duration: settledSettings?.duration ? Number(settledSettings.duration) : undefined,
              ...(actionHint ? { actionHint } : {}),
              mode: 'consult'
            }),
            signal: controller.signal
          });
          clearTimeout(timeout);

          if (!response.ok) {
            let errorMsg = 'Failed to consult AI';
            try {
              const errData = await response.json();
              errorMsg = errData.response || errData.error || errorMsg;
            } catch {}
            throw new Error(errorMsg);
          }
          const data = await response.json();
          
          if (data.status === 'completed') {
            setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Generation complete!' }]);
            setReadyToGenerate(true);
            // User must explicitly tap the wand — do NOT auto-trigger onGenerate
          } else if (data.status === 'error') {
            setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Something went wrong. Please try again.' }]);
          } else {
            // ai_response or needs_refinement
            setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.message || '' }]);
          }
        } catch (error) {
          console.error('Consultation error:', error);
          const isTimeout = error instanceof DOMException && error.name === 'AbortError';
          setMessages(prev => [...prev, { role: 'assistant', content: 
            isTimeout 
              ? 'AI is taking too long. Please try a simpler description or tap Generate to start.'
              : (error instanceof Error ? error.message : 'Failed to consult AI.')
          }]);
        } finally {
          setIsTyping(false);
        }
      };
      
      sendIdeaToConsultant();
    }
  }, [idea, context, lastIdea]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Once conversation has started (≥2 messages), user can generate anytime
  const canGenerate = messages.length >= 2 && !!onGenerate;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('empire_userId') : null;
      const brandId = typeof window !== 'undefined' ? localStorage.getItem('empire_brandId') : null;
      const conversationHistory = updatedMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(`${API_URL}/api/studio/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
          ...(userId ? { 'x-user-id': userId } : {})
        },
        body: JSON.stringify({ 
          request: `${userMessage}${settledBlock()}`,
          brandId: brandId || undefined,
          conversationHistory: [
            ...(settledFacts().length ? [{ role: 'assistant' as const, content: `SETTLED — user already chose: ${settledFacts().join(', ')} (do not re-ask)` }] : []),
            ...conversationHistory
          ],
          voice: settledSettings?.voice && settledSettings.voice !== 'auto' ? settledSettings.voice : undefined,
          tone: settledSettings?.tone && settledSettings.tone !== 'auto' ? settledSettings.tone : undefined,
          duration: settledSettings?.duration ? Number(settledSettings.duration) : undefined,
          ...(actionHint ? { actionHint } : {}),
          mode: 'consult'
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!response.ok) {
        let errorMsg = 'Failed to consult AI';
        try {
          const errData = await response.json();
          errorMsg = errData.response || errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      const data = await response.json();
      
      if (data.status === 'completed') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Generation complete!' }]);
        setReadyToGenerate(true);
        // User must explicitly tap the wand — do NOT auto-trigger onGenerate
      } else if (data.status === 'error') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Something went wrong. Please try again.' }]);
      } else {
        // ai_response or needs_refinement
        setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.message || '' }]);
      }
    } catch (error) {
      console.error('Consultation error:', error);
      const isTimeout = error instanceof DOMException && error.name === 'AbortError';
      const isNetworkError = !isTimeout && (error instanceof TypeError || (error instanceof Error && error.message.includes('fetch')));
      setMessages(prev => [...prev, { role: 'assistant', content: 
        isTimeout
          ? 'AI is taking too long. Please try a simpler description or tap Generate to start.'
          : isNetworkError
          ? "I'm having trouble connecting to the Neural Link. Please try again."
          : (error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // USER TURNS ONLY, PURPOSE-BUILT FOR THE SUBJECT OF THE VIDEO.
  // Owner's live Faceless test (Sep 21) narrated "What niche should we
  // dominate?" — the ASSISTANT's seeded greeting (messages[0], defaults
  // below) — because this summary joined every message and the backend
  // templates narration off the FIRST sentence of the blob it receives.
  // The user's turns are the actual concept (their product, their niche,
  // their vision); assistant replies/refinements are context, not the
  // subject. Excluding them makes the user's real concept the narration
  // source. Note: onConversation still relays the FULL conversation
  // (greeting + user + assistant) separately, so the Scene-Based pipeline
  // (page.tsx:490-493) keeps reading the whole chat and is unaffected.
  const conversationSummary = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ');

  const handleGenerate = () => {
    if (onGenerate && !isGenerating) {
      setIsGenerating(true);
      onGenerate(conversationSummary || idea || '');
    }
  };

  // Surface the refined idea to the parent whenever the conversation changes,
  // so a parent "Launch Project" button (suppressWand mode) can submit it.
  // Also relay the FULL conversation + extracted client components so the
  // Scene-Based payload can send both to the backend planner (owner: GPT must
  // read the whole conversation and hit every component the client relayed).
  useEffect(() => {
    if (onRefinedIdea && messages.length >= 1 && (conversationSummary || idea)) {
      onRefinedIdea(conversationSummary || idea || '');
    }
    if (onConversation && messages.length >= 1) {
      onConversation(messages.map(m => ({ role: m.role, content: m.content })));
    }
    if (onRelayedComponents && messages.length >= 1) {
      onRelayedComponents(extractRelayedComponentsFromConversation(messages));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <div className={cn(
      "flex flex-col bg-theme-background/40 border border-theme rounded-2xl overflow-hidden transition-all",
      className
    )}>
      {/* Mini Header */}
      <div className="px-2 py-1.5 border-b border-theme bg-theme-background/60 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-slate-400" />
          <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Consultant: {context.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-0.5 h-0.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[6px] font-bold text-emerald-500/70 uppercase">Online</span>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 min-h-[120px] max-h-[280px] overflow-y-auto p-3 space-y-2 no-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-1.5",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-lg flex items-center justify-center shrink-0 border border-theme",
                msg.role === 'user' ? "bg-white/10" : "bg-slate-500/10"
              )}>
                {msg.role === 'user' ? <User className="w-2 h-2 text-white" /> : <Bot className="w-2 h-2 text-slate-400" />}
              </div>
              <div className={cn(
                "px-2.5 py-2 rounded-xl text-xs leading-relaxed max-w-[85%]",
                msg.role === 'user' 
                  ? "bg-white text-slate-950 rounded-tr-none font-medium" 
                  : "bg-theme-surface border border-theme text-slate-300 rounded-tl-none italic"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex items-start gap-1.5">
            <div className="w-4 h-4 rounded-lg bg-slate-500/10 flex items-center justify-center border border-theme">
              <Bot className="w-2 h-2 text-slate-400" />
            </div>
            <div className="px-2 py-1.5 rounded-xl bg-theme-surface border border-theme">
              <Loader2 className="w-2.5 h-2.5 text-white animate-spin" />
            </div>
          </div>
        )}

      </div>

      {/* Mini Input + Generate */}
      <form onSubmit={handleSend} className="p-1.5 border-t border-theme bg-theme-background/40">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={submitted
              ? "Type a new message to start a new request, or check Operations for your video"
              : suppressWand ? "Chat with the AI to refine your idea, then launch..." : (canGenerate ? "Type to refine, or tap Generate..." : "Ask...")}
            className="flex-1 bg-theme-surface/50 border border-theme rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-white/40 transition-all placeholder:text-slate-600"
          />
          {/* Wand — appears once conversation started (hidden in suppressWand/Launch-Project mode) */}
          {canGenerate && !suppressWand && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isTyping || isGenerating}
              title="Generate"
              aria-label="Generate"
              className={cn(
                "w-8 h-8 rounded-lg bg-primary text-slate-950 flex items-center justify-center shrink-0 transition-all",
                isGenerating && "opacity-50 scale-90",
                !isGenerating && readyToGenerate && "animate-pulse ring-2 ring-primary/50"
              )}
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            </button>
          )}
          {/* Send — always present */}
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 hover:bg-white/20 transition-all disabled:opacity-30"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>

      {/* Hint bar — suppressed once a generation is submitted (no "refine here"
          invitation mid-flight; the parent passes `submitted` post-launch). */}
      {!submitted && !isTyping && messages.length >= 1 && (
        <div className="flex items-center gap-1.5 px-2 py-1 mx-1.5 mb-1.5 rounded-lg bg-primary/5 border border-primary/10">
          <ArrowDown className="w-2.5 h-2.5 text-primary" />
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
            {suppressWand
              ? "Refine here — then hit the Launch Project button"
              : (readyToGenerate ? "Ready to generate!" : canGenerate ? "Tap Generate when ready, or keep chatting" : "Chat with the AI to refine your idea")}
          </span>
        </div>
      )}
    </div>
  );
}