import React, { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { 
    User, 
    Mail, 
    Briefcase, 
    Star, 
    IndianRupee, 
    Shield, 
    CheckCircle2, 
    Edit3, 
    X, 
    Save, 
    Award,
    Clock,
    TrendingUp,
    Camera,
    Link as LinkIcon,
    Zap,
    Target
} from "lucide-react";
import { Button } from './ui/button';
import styled from 'styled-components';
import { cn } from "@/lib/utils";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState(new Set());
    const [bio, setBio] = useState("");
    const [photoPath, setPhotoPath] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);


    const fetchProfile = async () => {
        try {
            const res = await API.get(`/auth/me`);
            setProfile(res.data);
            setBio(res.data.bio || "");
            setPhotoPath(res.data.photoPath || "");
            if (res.data.skills) {
                setSelectedSkills(new Set(res.data.skills));
            }
            setLoading(false);
        } catch (err) {
            console.error("Failed to load profile");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const toggleSkill = (skill) => {
        const newSet = new Set(selectedSkills);
        newSet.has(skill) ? newSet.delete(skill) : newSet.add(skill);
        setSelectedSkills(newSet);
    };

    const handleSave = async () => {
        try {
            await API.put('/auth/me/update', {
                bio: bio,
                skills: Array.from(selectedSkills)
            });
            setIsEditing(false);
            fetchProfile();
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Save failed");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await API.post('/auth/me/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setPhotoPath(res.data.photoUrl);
            setUploading(false);
            alert("Profile picture updated successfully!");
            fetchProfile();
        } catch (err) {
            alert("Failed to upload image.");
            console.error(err);
            setUploading(false);
        }
    };

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

    if (!profile) return <div className="text-center py-20 italic text-zinc-500">Profile not found.</div>;

    const isFreelancer = profile.role === 'ROLE_FREELANCER';

    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-12">
            <StyledWrapper>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: User Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="card">
                            <div className="card-overlay" />
                            <div className="card-inner p-8 text-center flex flex-col items-center">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        hidden 
                                        accept="image/*" 
                                        onChange={handleImageUpload} 
                                    />
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-900 dark:bg-white flex items-center justify-center mb-6 shadow-2xl overflow-hidden border-4 border-white dark:border-zinc-800 transition-transform duration-500 group-hover:scale-105">
                                        {uploading ? (
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white dark:border-zinc-900"></div>
                                        ) : profile.photoPath ? (
                                            <img src={profile.photoPath} alt={profile.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-white dark:text-black" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-6 right-0 w-10 h-10 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-white dark:border-zinc-900 transition-transform group-hover:scale-110">
                                        <Edit3 className="w-5 h-5 text-white dark:text-black" />
                                    </div>
                                </div>
                                
                                <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-1">{profile.name}</h2>
                                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">{profile.email}</p>
                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                                    {profile.role.replace('ROLE_', '')}
                                </span>

                                <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 my-8" />

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="metric-mini p-4 bg-white/50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Available</p>
                                        <p className="mini-number text-sm font-black text-zinc-900 dark:text-white">₹{(profile.totalBalance - profile.lockedBalance).toFixed(0)}</p>
                                    </div>
                                    <div className="metric-mini p-4 bg-white/50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{isFreelancer ? 'Rating' : 'Escrow'}</p>
                                        <div className="flex items-center justify-center gap-1">
                                            {isFreelancer ? (
                                                <>
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    <span className="mini-number text-sm font-black text-zinc-900 dark:text-white">{profile.averageRating?.toFixed(1) || '0.0'}</span>
                                                </>
                                            ) : (
                                                <span className="mini-number text-sm font-black text-zinc-900 dark:text-white">₹{profile.lockedBalance.toFixed(0)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Profile Content */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Bio / About Section */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Professional Profile</h3>
                                </div>
                                <Button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant="outline"
                                    className="rounded-xl h-10 px-6 font-bold border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-widest"
                                >
                                    {isEditing ? <X className="w-4 h-4" /> : "Edit Profile"}
                                </Button>
                            </div>

                            {isEditing ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1 flex items-center gap-2">
                                            <Edit3 className="w-3 h-3" /> Bio / About
                                        </label>
                                        <textarea 
                                            value={bio} 
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Describe your expertise and what you bring to the table..." 
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white outline-none min-h-[140px] resize-none"
                                        />
                                    </div>
                                    
                                    {isFreelancer && (
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Expertise Tags</label>
                                            <div className="flex flex-wrap gap-2">
                                                {AVAILABBLE_SKILLS.map(skill => (
                                                    <button 
                                                        key={skill} 
                                                        onClick={() => toggleSkill(skill)} 
                                                        className={cn(
                                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                            selectedSkills.has(skill) 
                                                                ? "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105" 
                                                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                                        )}
                                                    >
                                                        {skill.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Button 
                                        onClick={handleSave}
                                        className="w-full h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-transform"
                                    >
                                        Save Professional Data
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium text-lg">
                                        {profile.bio || "No professional bio added yet. Tell the world what you do!"}
                                    </p>

                                    {isFreelancer && (
                                        <div className="flex flex-wrap gap-3">
                                            {profile.skills && profile.skills.length > 0 ? (
                                                profile.skills.map(skill => (
                                                    <span key={skill} className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-700/50 shadow-sm">
                                                        {skill.replace('_', ' ')}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-zinc-400 font-bold uppercase italic tracking-widest">No skills listed</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Professional Stats Section - 3D POP EFFECT */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {!isFreelancer ? (
                                <>
                                    <div className="metric-card bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                                <Briefcase className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Projects</h4>
                                        </div>
                                        <p className="metric-number text-4xl font-black text-zinc-900 dark:text-white transition-all duration-500 group-hover:scale-110 group-hover:text-indigo-600 origin-left">{profile.projectsPosted || 0}</p>
                                    </div>
                                    <div className="metric-card bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Hire Rate</h4>
                                        </div>
                                        <p className="metric-number text-4xl font-black text-emerald-600 transition-all duration-500 group-hover:scale-110 origin-left">{Math.round(profile.hireRate || 0)}%</p>
                                    </div>
                                    <div className="metric-card bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                                <IndianRupee className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Spent</h4>
                                        </div>
                                        <p className="metric-number text-4xl font-black text-zinc-900 dark:text-white transition-all duration-500 group-hover:scale-110 group-hover:text-amber-600 origin-left">₹{Math.round(profile.totalSpent || 0)}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="metric-card bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                                <Target className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Success</h4>
                                        </div>
                                        <p className="metric-number text-4xl font-black text-zinc-900 dark:text-white transition-all duration-500 group-hover:scale-110 group-hover:text-indigo-600 origin-left">{Math.round(profile.successRate || 0)}%</p>
                                    </div>
                                    <div className="metric-card bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Trust</h4>
                                        </div>
                                        <p className="metric-number text-4xl font-black text-purple-600 transition-all duration-500 group-hover:scale-110 origin-left">{Math.round(profile.trustScore || 0)}</p>
                                    </div>
                                    <div className="metric-card bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                                <Zap className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active</h4>
                                        </div>
                                        <p className="metric-number text-4xl font-black text-zinc-900 dark:text-white transition-all duration-500 group-hover:scale-110 group-hover:text-amber-600 origin-left">{profile.projectsInProgress || 0}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </StyledWrapper>
        </div>
    );
};

const StyledWrapper = styled.div`
  .card {
    --bg: #ffffff;
    --contrast: #f2f2f2;
    --grey: #93a1a1;
    position: relative;
    padding: 9px;
    background-color: var(--bg);
    border-radius: 45px;
    box-shadow: rgba(50, 50, 93, 0.1) 0px 50px 100px -20px, rgba(0, 0, 0, 0.1) 0px 30px 60px -30px, rgba(10, 37, 64, 0.2) 0px -2px 6px 0px inset;
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-conic-gradient(var(--bg) 0.0000001%, var(--grey) 0.000104%) 60% 60%/600% 600%;
    filter: opacity(10%) contrast(105%);
    border-radius: 45px;
  }

  .card-inner {
    width: 100%;
    background-color: var(--contrast);
    border-radius: 40px;
    position: relative;
    z-index: 1;
  }

  .metric-number {
    text-shadow: 1px 1px 0px rgba(0,0,0,0.05);
  }

  .metric-card:hover .metric-number {
    text-shadow: 2px 2px 10px rgba(0,0,0,0.1);
  }
`;

const AVAILABBLE_SKILLS = [
    "WEB_DEVELOPMENT",
    "MOBILE_APP",
    "DESIGN",
    "WRITING",
    "MARKETING",
    "DATA_SCIENCE",
    "SEO",
    "VIDEO_EDITING"
];

export default Profile;

