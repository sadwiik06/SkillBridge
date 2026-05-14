"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GradientCard } from "./ui/gradient-card";
import { PlusCircle, List, Wallet, Users, TrendingUp, ShieldCheck } from "lucide-react";
import API from "../api/axios";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBalance: 0,
    lockedBalance: 0,
    projectsPosted: 0,
    projectsInProgress: 0,
    projectsCompleted: 0,
    hireRate: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await API.get('/auth/me');
        setStats({
          totalBalance: userRes.data.totalBalance || 0,
          lockedBalance: userRes.data.lockedBalance || 0,
          projectsPosted: userRes.data.projectsPosted || 0,
          projectsInProgress: userRes.data.projectsInProgress || 0,
          projectsCompleted: userRes.data.projectsCompleted || 0,
          hireRate: Math.round(userRes.data.hireRate || 0),
          totalSpent: userRes.data.totalSpent || 0
        });
      } catch (err) {
        console.error("Failed to fetch client dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="mb-12 text-left">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2 text-shadow-lg">
          Client Dashboard
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 font-medium">
          Post new tasks, manage your hires, and track project funds.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Wallet / Funds Card */}
        <GradientCard
          gradient="green"
          badgeText="Available Funds"
          badgeColor="#10b981"
          title={`₹${stats.totalBalance}`}
          description="Your platform balance used to fund new milestones and pay freelancers."
          ctaText="Add Funds"
          ctaHref="/allocate-funds"
          onClick={() => navigate('/allocate-funds')}
        />

        {/* Post Project Card */}
        <GradientCard
          gradient="purple"
          badgeText="Quick Action"
          badgeColor="#8b5cf6"
          title="Post a New Task"
          description="Use Gemini AI to automatically generate milestone breakdowns for your project."
          ctaText="Create Project"
          ctaHref="/post-task"
          onClick={() => navigate('/post-task')}
        />

        {/* Manage Projects Card */}
        <GradientCard
          gradient="blue"
          badgeText="Project Tracking"
          badgeColor="#3b82f6"
          title={`${stats.projectsInProgress} In Progress`}
          description="Manage your active hires, review submissions, and release payments."
          ctaText="View Hire List"
          ctaHref="/manage-projects"
          onClick={() => navigate('/manage-projects')}
        />

        {/* Escrow Status Card */}
        <GradientCard
          gradient="orange"
          badgeText="Secured in Escrow"
          badgeColor="#f59e0b"
          title={`₹${stats.lockedBalance}`}
          description="Funds currently held securely for active milestones in your projects."
          ctaText="Wallet Details"
          ctaHref="/wallet"
          onClick={() => navigate('/wallet')}
        />

        {/* Hiring Stats Card */}
        <div className="lg:col-span-2 rounded-3xl bg-zinc-900 text-white p-8 flex flex-col justify-between border border-zinc-800 shadow-2xl">
           <div>
              <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 bg-zinc-800 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                 </div>
                 <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">Hiring Performance</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4 !text-white">
                You've hired freelancers for <span className="text-indigo-400 font-black">{stats.projectsPosted}</span> project{stats.projectsPosted !== 1 ? 's' : ''}!
              </h2>
              <p className="text-zinc-400 max-w-md">Your hire rate and payment history determine your reputation as a reliable client.</p>
           </div>
           
           <div className="mt-8 grid grid-cols-3 gap-4 border-t border-zinc-800 pt-8">
              <div>
                 <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Hire Rate</p>
                 <p className="text-xl font-bold">{stats.hireRate}%</p>
              </div>
              <div>
                 <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Total Spent</p>
                 <p className="text-xl font-bold">₹{Math.round(stats.totalSpent)}</p>
              </div>
              <div>
                 <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Completed</p>
                 <p className="text-xl font-bold">{stats.projectsCompleted}</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}