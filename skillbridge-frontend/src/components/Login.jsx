"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('email', res.data.email);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('user', JSON.stringify(res.data));
        
        if (res.data.role === 'ROLE_CLIENT') {
            navigate('/client-dashboard');
        } else {
            navigate('/freelancer-dashboard');
        }
    } catch (error) {
        alert("Login Failed: " + (error.response?.data || "Server Error"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4">
      <Card className="w-full max-w-sm shadow-xl rounded-3xl border border-gray-100 dark:border-zinc-900 overflow-hidden">
        <CardHeader className="pb-4 pt-8">
          <CardTitle className="text-xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
            Welcome Back
          </CardTitle>
          <p className="text-center text-[13px] text-gray-500 mt-0.5">
            Access your secure dashboard.
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-zinc-300">Email Address</Label>
              <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1 bg-white dark:bg-zinc-900 mt-1">
                <Mail className="w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password" className="text-gray-700 dark:text-zinc-300">Password</Label>
              </div>
              <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1 bg-white dark:bg-zinc-900 mt-1">
                <Lock className="w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none bg-transparent"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl hover:cursor-pointer text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium shadow-md transition-all"
            >
              Sign In
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            New to SkillBridge?{" "}
            <Link to="/register" className="text-black dark:text-white font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}