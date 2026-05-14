import React, { useState, useEffect } from "react";
import API from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Combobox } from "./ui/combobox";
import { Sparkles, Wallet, Send, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

const CreateProject = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: '',
        category: 'WEB_DEVELOPMENT'
    });
    const [availableBalance, setAvailableBalance] = useState(0);
    const [milestones, setMilestones] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await API.get('/auth/me');
                setAvailableBalance(res.data.totalBalance - res.data.lockedBalance);
            } catch (err) {
                console.error("Error fetching user data");
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (val) => {
        setFormData({ ...formData, category: val });
    };

    const generateAIMilestones = async () => {
        if (!formData.description || !formData.budget) {
            alert("Please provide a description and budget first.");
            return;
        }
        setIsGenerating(true);
        try {
            const res = await API.post('/ai/suggest', {
                description: formData.description,
                budget: formData.budget
            });
            const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            setMilestones(data);
        } catch (err) {
            console.error("AI Generation failed", err);
            alert("Failed to generate milestones. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (parseFloat(formData.budget) > availableBalance) {
            return;
        }

        try {
            await API.post('/projects/create', { ...formData, milestones });
            setSubmitted(true);
            setFormData({
                title: "",
                description: "",
                budget: "",
                category: "WEB_DEVELOPMENT"
            });
            setMilestones([]);
        } catch (err) {
            alert("Failed to create project");
        }
    };

    if (submitted) {
        return (
            <div className="w-full max-w-2xl mx-auto px-6 py-20">
                <Card className="rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
                    <CardContent className="pt-12 pb-12 text-center">
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Project Posted!</h2>
                        <p className="text-zinc-500 mb-8 max-w-md mx-auto">Your project has been successfully created and the funds have been safely locked in escrow.</p>
                        <Button 
                            onClick={() => setSubmitted(false)}
                            className="rounded-2xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black h-12 px-8 font-bold"
                        >
                            Post Another Task
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-12">
            <Card className="rounded-[2.5rem] border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
                <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 p-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                Post a new Task
                            </CardTitle>
                            <p className="text-xs text-zinc-500 mt-1">Hire top talent and pay only when milestones are completed.</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-2xl border border-zinc-100 dark:border-zinc-700 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-indigo-500" />
                            <div className="flex flex-col">
                                <span className="text-[8px] font-bold uppercase text-zinc-400">Available</span>
                                <span className="text-xs font-black text-zinc-900 dark:text-white">₹{availableBalance}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title" className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Project Title</Label>
                                <Input 
                                    id="title"
                                    name="title"
                                    placeholder="e.g. Build a Landing Page for SaaS"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="rounded-xl h-12 border-zinc-200 dark:border-zinc-800"
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Category</Label>
                                <Combobox 
                                    placeholder="Select category..." 
                                    value={formData.category} 
                                    onChange={handleCategoryChange}
                                >
                                    <Combobox.Input />
                                    <Combobox.List>
                                        {categories.map(cat => (
                                            <Combobox.Option key={cat} value={cat}>
                                                {cat.replace('_', ' ')}
                                            </Combobox.Option>
                                        ))}
                                    </Combobox.List>
                                </Combobox>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="budget" className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Total Budget (₹)</Label>
                                <Input 
                                    id="budget"
                                    name="budget"
                                    type="number"
                                    placeholder="0"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className={`rounded-xl h-12 border-zinc-200 dark:border-zinc-800 ${formData.budget > availableBalance ? 'border-red-500' : ''}`}
                                    required 
                                />
                                {formData.budget > availableBalance && (
                                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Budget exceeds available funds
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Project Description</Label>
                            <Textarea 
                                id="description"
                                name="description"
                                placeholder="Describe your project requirements in detail..."
                                value={formData.description}
                                onChange={handleChange}
                                className="rounded-xl min-h-[120px] border-zinc-200 dark:border-zinc-800"
                                required 
                            />
                        </div>

                        {milestones.length > 0 && (
                            <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-indigo-500" /> AI Suggested Milestones
                                </h4>
                                <div className="space-y-4">
                                    {milestones.map((m, index) => (
                                        <div key={index} className="flex justify-between items-center border-b border-zinc-200/50 dark:border-zinc-800 pb-3">
                                            <div>
                                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{m.title}</p>
                                                <p className="text-[10px] text-zinc-500 line-clamp-1">{m.description}</p>
                                            </div>
                                            <span className="text-sm font-black text-indigo-600 ml-4">₹{m.amount}</span>
                                        </div>
                                    ))}
                                    <div className="pt-2 flex justify-between items-center text-xs">
                                        <span className="text-zinc-400 font-bold uppercase">Total Project Lock</span>
                                        <span className="text-zinc-900 dark:text-white font-black">₹{formData.budget}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button 
                                type="button" 
                                onClick={generateAIMilestones} 
                                disabled={isGenerating || !formData.description || !formData.budget}
                                className="flex-1 h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 group order-2 sm:order-1"
                            >
                                {isGenerating ? (
                                    <>Analyzing...</>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        {milestones.length > 0 ? "Regenerate Milestones" : "AI Milestones"}
                                    </div>
                                )}
                            </Button>

                            <Button 
                                type="submit" 
                                disabled={formData.budget > availableBalance || !formData.title || isGenerating}
                                className="flex-[1.5] h-14 rounded-[1.5rem] bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black font-black text-lg shadow-xl uppercase tracking-tight flex items-center justify-center gap-2 group order-1 sm:order-2"
                            >
                                Post Project <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        <p className="text-[9px] text-zinc-400 text-center italic">All project funds are automatically locked in escrow for security.</p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateProject;
