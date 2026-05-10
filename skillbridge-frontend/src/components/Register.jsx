import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from './ui/AuroraBackground';

const Register = ( )=>{
    const [formData, setFormData] = useState({name:'',email:'',password:'', role: 'ROLE_CLIENT'});
    const navigate = useNavigate();
    
    const handleChange = (e) =>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            await API.post('/auth/register',formData);
            alert("Registration successful! Please Login");
            navigate('/login');
        } catch(error){
            alert("Registration failed: " + (error.response?.data || "Server Error"))
        }
    };

    return(
        <AuroraBackground>
            <div className="relative z-10 w-full max-w-lg px-8 py-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Join SkillBridge</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Create your account to get started</p>
                </div>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                        <input 
                            name="name" 
                            type="text" 
                            placeholder="John Doe" 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="name@example.com" 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="••••••••" 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">I want to:</label>
                        <select 
                            name="role" 
                            onChange={handleChange} 
                            value={formData.role}
                            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                        >
                            <option value="ROLE_CLIENT">Hire Freelancers (Client)</option>
                            <option value="ROLE_FREELANCER">Find Work (Freelancer)</option>
                        </select>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                    >
                        Create Account
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Already have an account? 
                        <button onClick={() => navigate('/login')} className="ml-1 text-indigo-600 font-semibold hover:underline">Log in</button>
                    </p>
                </div>
            </div>
        </AuroraBackground>
    )
}
export default Register;