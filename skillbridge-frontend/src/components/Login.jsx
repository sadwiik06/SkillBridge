import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from './ui/AuroraBackground';

const Login = () =>{
    const [formData,setFormData] = useState({email:'',password: ''})
    const navigate = useNavigate();
    
    const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    };
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const res =await API.post('/auth/login',formData);
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('email',res.data.email);
            localStorage.setItem('role',res.data.role);
            localStorage.setItem('name',res.data.name);
            localStorage.setItem('user', JSON.stringify(res.data));
            if(res.data.role === 'ROLE_CLIENT'){
                navigate('/client-dashboard');
            }else{
                navigate('/freelancer-dashboard');
            }
        } catch(error){
            alert("Login Failed: "+(error.response?.data || "Unknown error"));
        }
    };

    return(
        <AuroraBackground>
            <div className="relative z-10 w-full max-w-md px-8 py-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Log in to your SkillBridge account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Don't have an account? 
                        <button onClick={() => navigate('/register')} className="ml-1 text-indigo-600 font-semibold hover:underline">Sign up</button>
                    </p>
                </div>
            </div>
        </AuroraBackground>
    )
}

export default Login;