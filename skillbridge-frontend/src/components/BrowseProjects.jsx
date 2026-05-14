import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Button, LiquidButton } from './ui/button';
import { Search, CheckCircle2 } from "lucide-react";
import styled from 'styled-components';

const BrowseProjects = () => {
    const [projects, setProjects] = useState([]);
    const [category, setCategory] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [bidData, setBidData] = useState({ bidAmount: '', proposalMessage: '' });
    const [myBids, setMyBids] = useState([]);
    
    const categories = [
        "WEB_DEVELOPMENT",
        "MOBILE_APP",
        "CONTENT_WRITING",
        "GRAPHIC_DESIGN",
        "DIGITAL_MARKETING",
        "VIDEO_EDITING",
        "DATA_ENTRY",
        "UI_UX_DESIGN",
        "SEO_SPECIALIST",
        "AI_ML_DEVELOPMENT"
    ];

    const fetchProjects = async () => {
        try {
            const url = category ? `/projects/search?category=${category}` : '/projects/search';
            const res = await API.get(url);
            setProjects(res.data);
        } catch (err) {
            console.error("Error fetching projects");
        }
    };

    const fetchMyBids = async () => {
        try {
            const res = await API.get('/bids/my-bids');
            setMyBids(res.data);
        } catch (err) {
            console.error("Error fetching my bids");
        }
    }

    useEffect(() => {
        fetchProjects();
        fetchMyBids();
    }, [category]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/bids/place?projectId=${selectedProject.id}`, bidData);
            alert("Bid placed successfully!");
            setSelectedProject(null);
            fetchMyBids();
        } catch (err) {
            alert("Failed to place Bid.");
        }
    }

    const hasAlreadyBidded = (projectId) => {
        return myBids.some(bid => bid.project.id === projectId);
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            {/* Centered Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                    Available Projects
                </h1>
            </div>

            {/* Centered Categories with Advanced Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
                <LiquidButton 
                    variant={!category ? "secondary" : "default"} 
                    size="sm"
                    onClick={() => setCategory('')}
                >
                    ALL
                </LiquidButton>
                
                {categories.map((cat) => (
                    <LiquidButton 
                        key={cat} 
                        variant={category === cat ? "secondary" : "default"}
                        size="sm"
                        onClick={() => setCategory(cat)}
                    >
                        {cat.replace('_', ' ')}
                    </LiquidButton>
                ))}
            </div>

            {/* Projects Grid */}
            <StyledWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {(!Array.isArray(projects) || projects.length === 0) ? (
                        <div className="col-span-full py-20 text-center">
                            <Search className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                            <p className="text-zinc-500 font-medium italic">No projects found in this category.</p>
                        </div>
                    ) : (
                        projects.map((proj) => (
                            <div key={proj.id} className="card-container">
                                <div className="card">
                                    <div className="card-overlay" />
                                    <div className="card-inner flex flex-col p-8 text-left items-start justify-between h-full">
                                        <div className="w-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="px-3 py-1 rounded-full bg-black/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                                    {proj.category.replace('_', ' ')}
                                                </span>
                                                <span className="text-xl font-black text-zinc-900">₹{proj.budget}</span>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-zinc-800 mb-2 leading-tight">
                                                {proj.title}
                                            </h3>
                                            
                                            {proj.client && (
                                                <Link 
                                                    to={`/profile/${proj.client.id}`} 
                                                    className="text-xs font-medium text-zinc-400 hover:text-indigo-600 transition-colors mb-4 block"
                                                >
                                                    by {proj.client.name}
                                                </Link>
                                            )}
                                            
                                            <p className="text-sm text-zinc-500 line-clamp-4 mb-6 leading-relaxed">
                                                {proj.description}
                                            </p>
                                        </div>

                                        <div className="w-full mt-auto">
                                            {hasAlreadyBidded(proj.id) ? (
                                                <Button disabled variant="outline" className="w-full rounded-2xl opacity-50 text-sm h-10">
                                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Applied
                                                </Button>
                                            ) : (
                                                <Button 
                                                    onClick={() => setSelectedProject(proj)} 
                                                    className="w-full rounded-xl bg-zinc-800 hover:bg-black text-white shadow-md font-bold text-sm h-10"
                                                >
                                                    Apply Now
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </StyledWrapper>

            {/* Application Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 max-w-xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Apply for Project</h3>
                        <p className="text-slate-500 mb-6 text-sm">Submit your proposal for <span className="font-bold text-slate-900 dark:text-white">"{selectedProject.title}"</span></p>
                        
                        {selectedProject.milestones && selectedProject.milestones.length > 0 && (
                            <div className="mb-8 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-indigo-500" /> AI-Generated Milestones
                                </h4>
                                <div className="space-y-4">
                                    {selectedProject.milestones.map((m) => (
                                        <div key={m.id} className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                                            <div>
                                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{m.title}</p>
                                                <p className="text-[10px] text-zinc-500">{m.description}</p>
                                            </div>
                                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap ml-4">₹{m.amount}</span>
                                        </div>
                                    ))}
                                    <div className="pt-2 flex justify-between items-center font-black text-sm">
                                        <span className="text-zinc-400 uppercase text-[10px]">Total Fixed Budget</span>
                                        <span className="text-zinc-900 dark:text-white">₹{selectedProject.budget}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleBidSubmit} className="space-y-4">
                            {(!selectedProject.milestones || selectedProject.milestones.length === 0) && (
                                <div>
                                    <label className="text-xs font-bold uppercase text-zinc-400 mb-1 block">Your Bid Amount (₹)</label>
                                    <input 
                                        type="number"
                                        placeholder="Enter amount..."
                                        onChange={(e) => setBidData({ ...bidData, bidAmount: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        required 
                                    />
                                </div>
                            )}
                            
                            <div>
                                <label className="text-xs font-bold uppercase text-zinc-400 mb-1 block">Proposal Message</label>
                                <textarea 
                                    placeholder="Why should we hire you? Describe your relevant experience..."
                                    onChange={(e) => setBidData({ ...bidData, proposalMessage: e.target.value })}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="flex-1 rounded-2xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black font-bold h-12 shadow-lg">
                                    Send Proposal
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setSelectedProject(null)} className="flex-1 rounded-2xl h-12 border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BrowseProjects;

const StyledWrapper = styled.div`
  .card-container {
    perspective: 1000px;
    height: 380px; /* Fixed height for consistency */
  }

  .card {
    --bg: #ffffff;
    --contrast: #f2f2f2;
    --grey: #93a1a1;
    position: relative;
    padding: 9px;
    background-color: var(--bg);
    border-radius: 35px;
    height: 100%;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    transition: transform 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
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
    height: 100%;
    background-color: var(--contrast);
    border-radius: 30px;
    position: relative;
    z-index: 1;
  }
`;