1	"use client";
2	
3	import React from 'react';
4	import Link from 'next/link';
5	import { usePathname } from 'next/navigation';
6	import {
7	  LayoutDashboard,
8	  Settings,
9	  Stars,
10	  ClipboardCheck,
11	  BarChart3,
12	  ShieldCheck,
13	  Video,
14	  Sparkles
15	} from 'lucide-react';
16	import { BrandedGlobe } from '@/components/BrandedGlobe';
17	import { cn } from '@/lib/utils';
18	
19	import { useEmpire } from '@/lib/EmpireContext';
20	import { analyticsService, empireService } from '@/lib/api-service';
21	
22	const navItems = [
23	  { name: 'HOME', href: '/dashboard', icon: LayoutDashboard },
24	  { name: 'OB', href: '/empire-center', icon: ClipboardCheck },
25	  { name: 'Studio', href: '/studio', icon: Video },
26	  { name: 'LC', href: '/link-center', icon: Stars },
27	  { name: 'Settings', href: '/settings', icon: Settings },
28	];
29	
30	export function Sidebar() {
31	  const pathname = usePathname();
32	  const { activeEmpire, isAdmin } = useEmpire();
33	  const displayNiche = (isAdmin && (!activeEmpire?.niche || activeEmpire?.niche === 'Niche Pending')) ? "AI Business Automation" : (activeEmpire?.niche || "your niche");
34	
35	  return (
36	    <>
37	      <div className="hidden lg:flex flex-col w-64 bg-theme-surface text-foreground h-screen fixed left-0 top-0 border-r border-theme shadow-sm transition-all duration-300 z-[10005] pointer-events-auto">
38	        <div className="p-6 flex items-center gap-3">
39	          <BrandedGlobe size="md" spinning />
40	          <span className="text-lg font-black tracking-tight text-theme-gradient uppercase italic truncate">
41	            EmpireLaunch AI
42	          </span>
43	        </div>
44	
45	        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar relative z-[5001]">
46	          {navItems.map((item) => {
47	            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
48	            return (
49	              <Link
50	                key={item.name}
51	                href={item.href}
52	                className={cn(
53	                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm cursor-pointer select-none relative z-[5002]",
54	                  isActive
55	                  ? "bg-primary text-white shadow-xl shadow-primary/20 pointer-events-auto"
56	                  : "text-white/40 hover:text-white hover:bg-theme-background pointer-events-auto"
57	                )}
58	              >
59	                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-primary/60")} />
60	                <span className="truncate">{item.name}</span>
61	              </Link>
62	            );
63	          })}
64	
65	          <div className="mt-8 px-4 pt-6 border-t border-theme">
66	            <div className="flex items-center gap-2 mb-4">
67	              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
68	              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Brain Live</span>
69	            </div>
70	            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
71	               <p className="text-[11px] font-bold text-primary leading-relaxed italic">
72	                 "Analyzing market trends for '{displayNiche}'... I'll suggest new content soon."
73	               </p>
74	            </div>
75	          </div>
76	        </nav>
77	
78	        <div className="p-6 border-t border-theme bg-theme-surface">
79	          <div className="flex items-center gap-3">
80	            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-theme flex items-center justify-center shadow-lg overflow-hidden group hover:border-primary/50 transition-colors">
81	               <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-[10px] group-hover:bg-primary group-hover:text-white transition-all">
82	                 {String(activeEmpire?.name || 'E').substring(0, 1).toUpperCase()}
83	               </div>
84	            </div>
85	            <div className="flex flex-col truncate">
86	              <span className="text-sm font-black text-white truncate">Founder</span>
87	              <span className="text-[10px] font-black text-primary uppercase tracking-widest truncate">
88	                {activeEmpire?.name || "Empire Owner"}
89	              </span>
90	            </div>
91	          </div>
92	        </div>
93	      </div>
94	    </>
95	  );
96	}
