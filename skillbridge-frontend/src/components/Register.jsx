"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Lock, CheckCircle, Circle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from '../api/axios';
import { cn } from "@/lib/utils";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_FREELANCER");
  const navigate = useNavigate();

  const checks = useMemo(() => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[@#$%^&+=!]/.test(password),
  }), [password]);

  const isPasswordValid = Object.values(checks).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    try {
        await API.post('/auth/register', { name, email, password, role });
        alert("Registration successful! Please Login");
        navigate('/login');
    } catch (error) {
        alert("Registration failed: " + (error.response?.data || "Server Error"));
    }
  };

  const Requirement = ({ met, label }) => (
    <div className={cn(
      "flex items-center gap-1.5 text-xs mt-1 transition-colors duration-200",
      met ? "text-green-600 font-medium" : "text-gray-400"
    )}>
      {met ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
      {label}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <Card className="w-full max-w-sm shadow-xl rounded-3xl border border-gray-100 dark:border-zinc-900 overflow-hidden bg-white dark:bg-zinc-950">
        <CardHeader className="pb-4 pt-8">
          <CardTitle className="text-xl font-bold text-center text-gray-900 dark:text-white tracking-tight">
            Join SkillBridge
          </CardTitle>
          <p className="text-center text-[13px] text-gray-500 mt-0.5">
            Create an account to start secure work.
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <Label htmlFor="name" className="text-[13px] font-medium text-gray-700 dark:text-zinc-300">Full Name</Label>
              <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1 bg-white dark:bg-zinc-900 mt-1.5 focus-within:ring-2 focus-within:ring-black/5 transition-all">
                <User className="w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none bg-transparent h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-[13px] font-medium text-gray-700 dark:text-zinc-300">Email Address</Label>
              <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1 bg-white dark:bg-zinc-900 mt-1.5 focus-within:ring-2 focus-within:ring-black/5 transition-all">
                <Mail className="w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none bg-transparent h-9 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-[13px] font-medium text-gray-700 dark:text-zinc-300">Password</Label>
              <div className="flex items-center gap-2 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1 bg-white dark:bg-zinc-900 mt-1.5 focus-within:ring-2 focus-within:ring-black/5 transition-all">
                <Lock className="w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none bg-transparent h-9 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-x-2 mt-2">
                <Requirement met={checks.length} label="8+ characters"/>
                <Requirement met={checks.upper} label="Uppercase"/>
                <Requirement met={checks.lower} label="Lowercase"/>
                <Requirement met={checks.number} label="Number"/>
                <Requirement met={checks.symbol} label="Special char"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                type="button"
                variant={role === "ROLE_FREELANCER" ? "default" : "outline"}
                onClick={() => setRole("ROLE_FREELANCER")}
                className={cn(
                    "rounded-xl transition-all text-xs h-9",
                    role === "ROLE_FREELANCER" ? "bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800" : "hover:bg-zinc-50"
                )}
              >
                Freelancer
              </Button>
              <Button
                type="button"
                variant={role === "ROLE_CLIENT" ? "default" : "outline"}
                onClick={() => setRole("ROLE_CLIENT")}
                className={cn(
                    "rounded-xl transition-all text-xs h-9",
                    role === "ROLE_CLIENT" ? "bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800" : "hover:bg-zinc-50"
                )}
              >
                Client
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!isPasswordValid}
              className="w-full rounded-xl hover:cursor-pointer text-white bg-black hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium shadow-sm transition-all mt-4 h-10"
            >
              Create Account
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-black dark:text-white font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}