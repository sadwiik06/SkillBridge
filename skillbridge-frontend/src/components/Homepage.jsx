"use client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuroraBackground } from "./ui/AuroraBackground";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <AuroraBackground>
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Badge */}
        <div className="mb-4 rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          ✨ Powered by Gemini AI
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-7xl font-bold dark:text-white text-slate-900 tracking-tight">
          SkillBridge <br /> 
          <span className="text-indigo-600">Secure. Smart. Scalable.</span>
        </h1>

        {/* Subtext - Focusing on the Value Prop */}
        <p className="mt-6 max-w-2xl text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          The next-gen freelance marketplace. <b>AI-driven milestones</b> for clear roadmaps 
          and <b>automated escrow</b> to ensure you get paid for every deliverable.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
          >
            Get Started
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            Log In
          </button>
        </div>

        {/* Features Preview (Trust Markers) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-4 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/20">
                <h3 className="font-bold text-slate-900 dark:text-white">Escrow Protection</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Funds are locked before work begins. No more payment chasing.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/20">
                <h3 className="font-bold text-slate-900 dark:text-white">AI Milestones</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Gemini intelligently splits tasks into paid deliverables.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/20">
                <h3 className="font-bold text-slate-900 dark:text-white">Verified Trust</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Transparent hire rates and transaction history for every user.</p>
            </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
