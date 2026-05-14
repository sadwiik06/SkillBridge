"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GradientCard } from "./ui/gradient-card";
import { Wallet, Briefcase, Search, User, TrendingUp, ShieldCheck } from "lucide-react";
import API from "../api/axios";

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBalance: 0,
    activeProjects: 0,
    completedProjects: 0,
    trustScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await API.get('/auth/me');
        setStats({
          totalBalance: userRes.data.totalBalance || 0,
          activeProjects: userRes.data.projectsInProgress || 0,
          completedProjects: userRes.data.projectsCompleted || 0,
          successRate: Math.round(userRes.data.successRate || 0),
          trustScore: Math.round(userRes.data.trustScore || 0),
          averageRating: userRes.data.averageRating || 0,
          totalReviews: userRes.data.totalReviews || 0
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
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
          Freelancer Dashboard
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 font-medium">
          Manage your work, track earnings, and find new opportunities.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Wallet / Earnings Card */}
        <GradientCard
          gradient="orange"
          badgeText="Live Balance"
          badgeColor="#f59e0b"
          title={`₹${stats.totalBalance}`}
          description="Your current earnings ready for withdrawal or locked in escrow."
          ctaText="Manage Wallet"
          ctaHref="/wallet"
          onClick={() => navigate('/wallet')}
          className="lg:col-span-1"
        />

        {/* Active Projects Card */}
        <GradientCard
          gradient="purple"
          badgeText="Active Work"
          badgeColor="#8b5cf6"
          title={`${stats.activeProjects} Active Tasks`}
          description="Track your current milestones and submit deliverables for approval."
          ctaText="View Active Jobs"
          ctaHref="/my-projects"
          onClick={() => navigate('/my-projects')}
        />

        {/* Browse Jobs Card */}
        <GradientCard
          gradient="blue"
          badgeText="New Opportunities"
          badgeColor="#3b82f6"
          title="Find Your Next Gig"
          description="Explore the latest tasks powered by Gemini AI milestone breakdown."
          ctaText="Browse Marketplace"
          ctaHref="/browse"
          onClick={() => navigate('/browse')}
        />

        {/* Rating / Profile Card */}
        <GradientCard
          gradient="green"
          badgeText="Performance"
          badgeColor="#10b981"
          title={`${stats.averageRating} / 5.0 Rating`}
          description="Factual reliability rating based on client reviews and completion history."
          ctaText="View Public Profile"
          ctaHref="/profile"
          onClick={() => navigate('/profile')}
        />

        {/* Quick Stats / Info Card */}
        <div className="lg:col-span-2 rounded-3xl bg-zinc-900 text-white p-8 flex flex-col justify-between border border-zinc-800 shadow-2xl">
           <div>
              <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 bg-zinc-800 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                 </div>
                 <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">Platform Activity</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4 !text-white">
                You've successfully completed <span className="text-emerald-400 font-black">{stats.completedProjects}</span> project{stats.completedProjects !== 1 ? 's' : ''} on SkillBridge!
              </h2>
              <p className="text-zinc-400 max-w-md">Your reliability is calculated based on completed milestones and verified escrow releases.</p>
           </div>
           
           <div className="mt-8 grid grid-cols-3 gap-4 border-t border-zinc-800 pt-8">
              <div>
                 <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Avg. Rating</p>
                 <p className="text-xl font-bold">{stats.averageRating} / 5.0</p>
              </div>
              <div>
                 <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Reviews</p>
                 <p className="text-xl font-bold">{stats.totalReviews}</p>
              </div>
              <div>
                 <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Success Rate</p>
                 <p className="text-xl font-bold">{stats.successRate}%</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}