import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import API from '../api/axios';
import ReviewForm from './ReviewForm';
import { Button } from './ui/button';
import { 
    Briefcase, 
    CheckCircle2, 
    Clock, 
    ExternalLink, 
    MessageSquare, 
    Star, 
    User, 
    Trophy
} from "lucide-react";
import styled from 'styled-components';
import { cn } from "@/lib/utils";

const ManageProjects = () => {
    const navigate = useNavigate();
    const [myProjects, setMyProjects] = useState([]);

    const [selectProjectBids, setSelectedProjectBids] = useState([]);
    const [viewingBidsFor, setViewingBidsFor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchmyprojects = async () => {
            try {
                const res = await API.get(`/projects/my-projects`);
                setMyProjects(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching your projects");
                setLoading(false);
            }
        };
        fetchmyprojects();
    }, []);

    const handleViewBids = async (projectId) => {
        try {
            const res = await API.get(`/bids/project/${projectId}`);
            setSelectedProjectBids(res.data);
            setViewingBidsFor(projectId);
        } catch (err) {
            alert("Error loading bids");
        }
    };

    const handleAccepted = async (bidId) => {
        try {
            await API.post(`/bids/accept/${bidId}`);
            alert("Bid Accepted! Freelancer hired");
            setViewingBidsFor(null);
            window.location.reload();
        } catch (err) {
            alert("failed to accept bid");
        }
    };

    const handleReleaseFunds = async (projectId) => {
        try {
            await API.post(`/projects/${projectId}/release`);
            alert("Payment released. Project completed");
            window.location.reload();
        } catch (err) {
            alert("Failed to release funds");
        }
    };

    const handleReleaseMilestoneFunds = async (milestoneId) => {
        try {
            await API.post(`/projects/milestones/${milestoneId}/release`);
            alert("Milestone approved and funds released!");
            window.location.reload();
        } catch (err) {
            alert("Failed to release milestone funds");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'IN_PROGRESS': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
            case 'OPEN': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'SUBMITTED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    const sortedProjects = [...myProjects].sort((a, b) => {
        if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
        if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
        return 0;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                    <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-10">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                    My Hire List
                </h1>
                <p className="text-zinc-500 text-sm mt-2">Manage your projects, review bids, and release payments to freelancers.</p>
            </div>

            <StyledWrapper>
                <div className="columns-1 lg:columns-2 gap-8 space-y-8">
                    {sortedProjects.length === 0 ? (
                        <div className="break-inside-avoid py-20 text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
                            <Briefcase className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                            <p className="text-zinc-500 font-medium italic">No projects found. Post a new project to get started!</p>
                        </div>
                    ) : (
                        sortedProjects.map(proj => (
                            <div key={proj.id} className="card-container break-inside-avoid mb-8">
                                <div className="card">
                                    <div className="card-overlay" />
                                    <div className="card-inner p-8 flex flex-col h-full overflow-y-auto">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border w-fit",
                                                    getStatusColor(proj.status)
                                                )}>
                                                    {proj.status}
                                                </span>
                                                <h3 className="text-xl font-bold text-zinc-900 mt-2">{proj.title}</h3>
                                                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">Budget: ₹{proj.budget}</p>
                                            </div>
                                            
                                            {proj.status === 'OPEN' && (
                                                <Button 
                                                    onClick={() => handleViewBids(proj.id)}
                                                    size="sm"
                                                    className="rounded-xl h-8 text-[10px] bg-black text-white dark:bg-white dark:text-black font-bold"
                                                >
                                                    View Bids
                                                </Button>
                                            )}
                                            {(proj.status === 'IN_PROGRESS' || proj.status === 'SUBMITTED') && proj.freelancer && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate('/chat', {
                                                        state: {
                                                            contact: {
                                                                id: proj.freelancer.id,
                                                                name: proj.freelancer.name,
                                                                projectId: proj.id,
                                                                projectTitle: proj.title,
                                                                role: 'FREELANCER',
                                                            }
                                                        }
                                                    })}
                                                    className="rounded-xl h-8 text-[10px] border-zinc-200 flex items-center gap-1.5"
                                                >
                                                    <MessageSquare className="w-3 h-3" />
                                                    Message Freelancer
                                                </Button>
                                            )}
                                        </div>

                                        {proj.milestones && proj.milestones.length > 0 ? (
                                            <div className="space-y-4 mb-6">
                                                <h4 className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                                                    <Clock className="w-3 h-3" /> Milestones
                                                </h4>
                                                {proj.milestones.map(m => (
                                                    <div key={m.id} className="p-4 bg-white/50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-bold text-zinc-800">{m.title}</span>
                                                            <span className="text-sm font-black text-indigo-600">₹{m.amount}</span>
                                                        </div>
                                                        <p className="text-[11px] text-zinc-500 mb-3 line-clamp-2">{m.description}</p>
                                                        
                                                        <div className="flex items-center justify-between mt-4">
                                                            <span className={cn(
                                                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded-md",
                                                                getStatusColor(m.status)
                                                            )}>
                                                                {m.status}
                                                            </span>
                                                            
                                                            {m.status === 'SUBMITTED' && m.submissionUrl && (
                                                                <Button 
                                                                    onClick={() => handleReleaseMilestoneFunds(m.id)}
                                                                    size="sm"
                                                                    className="h-7 text-[10px] rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                                                >
                                                                    Approve & Release
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {m.status === 'SUBMITTED' && m.submissionUrl && (
                                                            <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/50 text-[10px]">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <ExternalLink className="w-3 h-3 text-indigo-500" />
                                                                    <a href={m.submissionUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline truncate">{m.submissionUrl}</a>
                                                                </div>
                                                                {m.submissionComment && (
                                                                    <div className="flex gap-2">
                                                                        <MessageSquare className="w-3 h-3 text-zinc-400 shrink-0 mt-0.5" />
                                                                        <p className="text-zinc-500 italic">"{m.submissionComment}"</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col justify-center py-4">
                                                {proj.status === 'IN_PROGRESS' && proj.submissionUrl && (
                                                    <div className="w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] p-6 border border-zinc-100 dark:border-zinc-800">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center">
                                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-bold text-zinc-900">Work Submitted!</h4>
                                                                <p className="text-[10px] text-zinc-500">Freelancer has completed the project.</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-3 mb-6">
                                                            <div className="flex items-center gap-2">
                                                                <ExternalLink className="w-3 h-3 text-indigo-500" />
                                                                <a href={proj.submissionUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline text-[10px] truncate">{proj.submissionUrl}</a>
                                                            </div>
                                                            {proj.submissionComment && (
                                                                <div className="flex gap-2">
                                                                    <MessageSquare className="w-3 h-3 text-zinc-400 shrink-0 mt-0.5" />
                                                                    <p className="text-[11px] text-zinc-500 italic">"{proj.submissionComment}"</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <Button 
                                                            onClick={() => handleReleaseFunds(proj.id)}
                                                            className="w-full h-10 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
                                                        >
                                                            Approve & Release Funds
                                                        </Button>
                                                    </div>
                                                )}
                                                
                                                {proj.status === 'COMPLETED' && (
                                                    <div className="text-center bg-emerald-50/50 dark:bg-emerald-500/5 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-500/20">
                                                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                            <Trophy className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Project Completed</p>
                                                        <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-widest font-black">Success</p>
                                                        
                                                        {!proj.reviewed ? (
                                                            <div className="mt-4 border-t border-emerald-100 dark:border-emerald-500/10 pt-4">
                                                                <ReviewForm
                                                                    projectId={proj.id}
                                                                    onReviewSubmitted={() => window.location.reload()}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                Review Submitted
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </StyledWrapper>

            {viewingBidsFor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingBidsFor(null)} />
                    <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[85vh] flex flex-col">
                        <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
                            <div>
                                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Bids Received</h3>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Review and hire the best candidate</p>
                            </div>
                            <Button variant="outline" onClick={() => setViewingBidsFor(null)} className="rounded-xl size-10 p-0 border-zinc-200 dark:border-zinc-800">
                                <span className="sr-only">Close</span>
                                ✕
                            </Button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto flex-1 space-y-6">
                            {selectProjectBids.length === 0 ? (
                                <div className="text-center py-12">
                                    <User className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                                    <p className="text-zinc-500 italic">No bids yet for this project.</p>
                                </div>
                            ) : (
                                selectProjectBids.map(bid => (
                                    <div key={bid.id} className="group p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/50 transition-all shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 shadow-sm">
                                                    <User className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <div>
                                                    <Link to={`/profile/${bid.freelancer?.id}`} className="text-base font-bold text-zinc-900 dark:text-white hover:text-indigo-600 transition-colors">
                                                        {bid.freelancer?.name || 'Unknown'}
                                                    </Link>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <div className="flex text-amber-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={cn("w-3 h-3 fill-current", i >= Math.round(bid.freelancer?.averageRating || 0) && "text-zinc-200 fill-transparent")} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] text-zinc-400 font-bold">({bid.freelancer?.totalReviews || 0})</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-black text-indigo-600">₹{bid.bidAmount}</span>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase">Proposal Amount</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                                "{bid.proposalMessage}"
                                            </p>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={() => handleAccepted(bid.id)}
                                                className="flex-1 h-11 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-[10px]"
                                            >
                                                Hire this Freelancer
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setViewingBidsFor(null);
                                                    navigate('/chat', {
                                                        state: {
                                                            contact: {
                                                                id: bid.freelancer?.id,
                                                                name: bid.freelancer?.name,
                                                                projectId: viewingBidsFor,
                                                                projectTitle: myProjects.find(p => p.id === viewingBidsFor)?.title,
                                                                role: 'FREELANCER',
                                                            }
                                                        }
                                                    });
                                                }}
                                                className="h-11 px-4 rounded-2xl border-zinc-200 flex items-center gap-1.5 text-[10px] font-bold"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                Message
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StyledWrapper = styled.div`
  .card-container {
    perspective: 1000px;
  }

  .card {
    --bg: #ffffff;
    --contrast: #f2f2f2;
    --grey: #93a1a1;
    position: relative;
    padding: 9px;
    background-color: var(--bg);
    border-radius: 35px;
    box-shadow: rgba(50, 50, 93, 0.1) 0px 50px 100px -20px, rgba(0, 0, 0, 0.1) 0px 30px 60px -30px, rgba(10, 37, 64, 0.2) 0px -2px 6px 0px inset;
    transition: transform 0.3s ease;
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-conic-gradient(var(--bg) 0.0000001%, var(--grey) 0.000104%) 60% 60%/600% 600%;
    filter: opacity(10%) contrast(105%);
    border-radius: 35px;
  }

  .card-inner {
    width: 100%;
    background-color: var(--contrast);
    border-radius: 30px;
    position: relative;
    z-index: 1;
    overflow-y: auto;
  }

  .card-inner::-webkit-scrollbar {
    width: 4px;
  }
  .card-inner::-webkit-scrollbar-track {
    background: transparent;
  }
  .card-inner::-webkit-scrollbar-thumb {
    background: #d1d1d1;
    border-radius: 10px;
  }
`;

export default ManageProjects;