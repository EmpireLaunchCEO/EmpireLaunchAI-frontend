"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { BuyButton } from '@/components/Public/BuyButton';
import { 
  ShieldCheck, 
  Globe, 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Heart,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicListingPage() {
  const params = useParams();
  const id = params?.id as string;

  // Mock product data - in a real app, this would be fetched from a database
  const product = {
    id: id || 'demo-123',
    name: 'Digital Empire Zen Planner 2024',
    price: '$24.99',
    seller: 'EmpireLaunch Creator',
    description: 'Master your workflow with the ultimate digital planner. Designed for high-performance entrepreneurs using the EmpireLaunch system. Includes 50+ templates for social media tracking, financial forecasting, and daily deep work sessions.',
    rating: 4.9,
    reviews: 128,
    features: [
      'Interactive PDF for iPad & Android',
      'Hyperlinked navigation',
      'Exclusive Empire Growth Score charts',
      'Syncs with Google Calendar'
    ],
    image: '/icon.png' // Fallback to app icon
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Public Header */}
      <nav className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
               <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase italic">EmpireLaunch Marketplace</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:block">Secure Checkout Active</span>
             <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-square bg-white rounded-[40px] shadow-xl border border-slate-100 flex items-center justify-center p-20 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110 duration-500" 
               />
               <div className="absolute top-6 left-6 bg-slate-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  Best Seller
               </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white rounded-2xl border border-slate-100 cursor-pointer hover:border-blue-600 transition-colors" />
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500">{product.rating} ({product.reviews} reviews)</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-blue-600">{product.price}</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">In Stock</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-3xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Merchant</p>
                  <p className="text-sm font-bold">{product.seller}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[8px] font-black uppercase">
                  <ShieldCheck size={12} /> Verified
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed font-medium">
                {product.description}
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <BuyButton 
                productId={product.id} 
                productName={product.name} 
                price={product.price} 
                sellerName={product.seller}
                className="flex-1"
              />
              <button className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                <Heart className="w-6 h-6 text-slate-400" />
              </button>
              <button className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                <Share2 className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="pt-8 border-t border-slate-200 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Delivery</span>
                  </div>
                  <p className="text-xs font-bold">Instant Download</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Payment Security</span>
                  </div>
                  <p className="text-xs font-bold">AES-256 GCM Encrypted</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
               <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-sm tracking-tighter uppercase italic">EmpireLaunch</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2024 EmpireLaunch AI. All rights reserved. Professional Merchant Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
