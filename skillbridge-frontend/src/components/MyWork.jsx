import React, { useState, useEffect } from "react";
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

import { Button } from './ui/button';
import { Briefcase, CheckCircle2, Clock, ExternalLink, MessageSquare, IndianRupee } from "lucide-react";

import styled from 'styled-components';

const MyWork = () => {
    const navigate = useNavigate();
    const [workList, setWorkList] = useState([]);

    const [submission, setSubmission] = useState({ url: '', comment: '' });
    const [submittingId, setSubmittingId] = useState(null);

    const handleSubmitWork = async (projectId) => {
        try {
            await API.post(`/projects/${projectId}/submit`, submission);
            alert("Project submitted for review!");
            fetchWork();
            setSubmittingId(null);
        } catch (err) {
            alert("Submission failed");
        }
    };

    const handleSubmitMilestoneWork = async (milestoneId) => {
        try {
            await API.post(`/projects/milestones/${milestoneId}/submit`, submission);
            alert("Milestone work submitted for review!");
            fetchWork();
            setSubmittingId(null);
        } catch (err) {
            alert("Submission failed");
        }
    };

    const fetchWork = async () => {
        try {
            const res = await API.get('/projects/my-work');
            setWorkList(res.data);
        } catch (err) {
            console.error("Error fetching work");
        }
    };

    useEffect(() => {
        fetchWork();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'IN_PROGRESS': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
            case 'SUBMITTED': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-10">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                    My Active Jobs
                </h1>
                <p className="text-zinc-500 text-sm mt-2">Manage your ongoing contracts, submit milestones, and track your earnings.</p>
            </div>

            <StyledWrapper>
                <div className="columns-1 lg:columns-2 gap-8 space-y-8">
                    {workList.length === 0 ? (
                        <div className="break-inside-avoid py-20 text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800">
                            <Briefcase className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                            <p className="text-zinc-500 font-medium italic">No active jobs found. Start bidding on projects!</p>
                        </div>
                    ) : (
                        workList.map(proj => (
                            <div key={proj.id} className="card-container break-inside-avoid mb-8">
                                <div className="card">
                                    <div className="card-overlay" />
                                    <div className="card-inner p-8 flex flex-col h-full overflow-y-auto">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(proj.status)}`}>
                                                    {proj.status}
                                                </span>
                                                <h3 className="text-xl font-bold text-zinc-900 mt-2">{proj.title}</h3>
                                                <p className="text-[10px] text-zinc-400 font-medium">Client: {proj.client?.name || 'Unknown'}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-xl font-black text-zinc-900 flex items-center">
                                                    <IndianRupee className="w-4 h-4 mr-0.5" />{proj.budget}
                                                </span>
                                                {proj.client && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => navigate('/chat', {
                                                            state: {
                                                                contact: {
                                                                    id: proj.client.id,
                                                                    name: proj.client.name,
                                                                    projectId: proj.id,
                                                                    projectTitle: proj.title,
                                                                    role: 'CLIENT',
                                                                }
                                                            }
                                                        })}
                                                        className="h-7 text-[10px] rounded-xl border-zinc-200 flex items-center gap-1.5"
                                                    >
                                                        <MessageSquare className="w-3 h-3" />
                                                        Message Client
                                                    </Button>
                                                )}
                                            </div>
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
                                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${getStatusColor(m.status)}`}>
                                                                {m.status}
                                                            </span>
                                                            
                                                            {proj.status === 'IN_PROGRESS' && m.status === 'PENDING' && (
                                                                <Button 
                                                                    onClick={() => setSubmittingId(m.id)}
                                                                    size="sm"
                                                                    className="h-7 text-[10px] rounded-lg bg-zinc-900 text-white"
                                                                >
                                                                    Submit Work
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {submittingId === m.id && (
                                                            <div className="mt-4 space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                                                <input 
                                                                    placeholder="GitHub Repo / Deliverable Link"
                                                                    onChange={(e) => setSubmission({ ...submission, url: e.target.value })}
                                                                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                                                                />
                                                                <textarea 
                                                                    placeholder="Add a comment..."
                                                                    onChange={(e) => setSubmission({ ...submission, comment: e.target.value })}
                                                                    className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none h-20"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <Button onClick={() => handleSubmitMilestoneWork(m.id)} className="flex-1 h-8 text-[10px] rounded-lg">Submit</Button>
                                                                    <Button onClick={() => setSubmittingId(null)} variant="outline" className="flex-1 h-8 text-[10px] rounded-lg">Cancel</Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col justify-center items-center py-6">
                                                {proj.status === 'IN_PROGRESS' && (
                                                    <div className="w-full space-y-4">
                                                        <div className="text-center mb-4">
                                                            <CheckCircle2 className="w-8 h-8 text-indigo-500 mx-auto mb-2 opacity-50" />
                                                            <p className="text-xs text-zinc-400">No milestones. Submit full project work below.</p>
                                                        </div>
                                                        <input 
                                                            placeholder="GitHub Repo / Deliverable Link"
                                                            onChange={(e) => setSubmission({ ...submission, url: e.target.value })}
                                                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                                                        />
                                                        <textarea 
                                                            placeholder="Add a comment for the client..."
                                                            onChange={(e) => setSubmission({ ...submission, comment: e.target.value })}
                                                            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none h-24"
                                                        />
                                                        <Button onClick={() => handleSubmitWork(proj.id)} className="w-full h-10 rounded-xl bg-zinc-900 text-white font-bold text-xs shadow-lg">
                                                            Submit Final Project Work
                                                        </Button>
                                                    </div>
                                                )}
                                                {proj.status === 'COMPLETED' && (
                                                    <div className="text-center">
                                                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </div>
                                                        <p className="text-sm font-bold text-zinc-800">Job Successfully Completed</p>
                                                        <p className="text-[10px] text-zinc-400">Payment has been released to your wallet.</p>
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
        </div>
    );
};

export default MyWork;

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
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
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

  /* Custom scrollbar for the card inner */
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