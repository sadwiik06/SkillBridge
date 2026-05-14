"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, Wallet, User, MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, Separator, SheetContext } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import API from '../api/axios';

const Navbar = ({ user: initialUser = {} }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token && (initialUser.role || localStorage.getItem('role'))) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Failed to refresh user data for navbar", err);
        }
      }
    };
    fetchUserData();
  }, [initialUser.role]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    navigate('/login');
    window.location.reload(); // Ensure state is cleared
  };

  const NavLinks = ({ variant = "desktop" }) => {
    const location = useLocation();
    const sheetContext = React.useContext(SheetContext);
    
    const getLinkClass = (path) => {
      const base = "text-sm font-medium transition-colors ";
      let active, inactive;

      if (variant === "mobile") {
        active = "text-white font-bold bg-zinc-900 px-3 py-2 rounded-xl ";
        inactive = "text-zinc-400 hover:text-white px-3 py-2 rounded-xl ";
      } else {
        active = "text-black dark:text-white font-bold ";
        inactive = "text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white ";
      }

      return base + (location.pathname === path ? active : inactive);
    };

    const handleClick = () => {
      if (variant === "mobile" && sheetContext) {
        sheetContext.setOpen(false);
      }
    };

    return (
      <>
        {user.role === 'ROLE_CLIENT' && (
          <>
            <Link to="/client-dashboard" className={getLinkClass("/client-dashboard")} onClick={handleClick}>Dashboard</Link>
            <Link to="/post-task" className={getLinkClass("/post-task")} onClick={handleClick}>Post a Task</Link>
            <Link to="/manage-projects" className={getLinkClass("/manage-projects")} onClick={handleClick}>My Hire List</Link>
            <Link to="/chat" className={getLinkClass("/chat")} onClick={handleClick}>Messages</Link>
            <Link to="/wallet" className={getLinkClass("/wallet")} onClick={handleClick}>Wallet</Link>
          </>
        )}
        {user.role === 'ROLE_FREELANCER' && (
          <>
            <Link to="/freelancer-dashboard" className={getLinkClass("/freelancer-dashboard")} onClick={handleClick}>Dashboard</Link>
            <Link to="/browse" className={getLinkClass("/browse")} onClick={handleClick}>Browse Jobs</Link>
            <Link to="/my-projects" className={getLinkClass("/my-projects")} onClick={handleClick}>Active Jobs</Link>
            <Link to="/chat" className={getLinkClass("/chat")} onClick={handleClick}>Messages</Link>
            <Link to="/wallet" className={getLinkClass("/wallet")} onClick={handleClick}>Earnings</Link>
          </>
        )}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full px-2 md:px-4 py-4">
      <nav className="mx-auto max-w-6xl flex items-center justify-between rounded-2xl md:rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md py-2 px-4 md:px-8 shadow-lg border border-zinc-200 dark:border-zinc-800">
        
        {/* Left Side: Logo & Desktop Links */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link to="/" className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white shrink-0">
            SkillBridge
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </div>
        </div>

        {/* Right Side: Wallet, Profile & Actions */}
        <div className="flex items-center space-x-2 md:space-x-3">
          
          {/* Dynamic Wallet Display */}
          {user.role && (
            <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs md:text-sm font-semibold text-slate-900 dark:text-white border border-zinc-200/50 dark:border-zinc-700/50">
              <Wallet className="h-3.5 w-3.5 md:h-4 md:w-4 text-black dark:text-white" />
              <span>
                ₹{user.role === 'ROLE_FREELANCER' 
                  ? (user.totalBalance || 0).toFixed(2) 
                  : ((user.totalBalance || 0) - (user.lockedBalance || 0)).toFixed(2)}
              </span>
            </div>
          )}

          <Separator orientation="vertical" className="hidden md:block h-6" />

          {/* Profile Section */}
          {user.role && (
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                <User className="h-4 w-4 text-slate-700 dark:text-zinc-300" />
              </Button>
            </Link>
          )}

          {/* Desktop Logout */}
          {user.role ? (
             <Button 
                onClick={handleLogout}
                className="hidden md:inline-flex h-8 rounded-xl bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 px-4 text-sm font-medium transition-all active:scale-95"
              >
                Logout
              </Button>
          ) : (
            <div className="hidden md:flex gap-2">
                <Button variant="ghost" className="h-8 rounded-xl" onClick={() => navigate('/login')}>Login</Button>
                <Button className="h-8 rounded-xl bg-black text-white dark:bg-white dark:text-black" onClick={() => navigate('/register')}>Join</Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden ml-1">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="mobile-menu-dark w-[300px] rounded-l-3xl border-l border-zinc-800 p-6 shadow-2xl">
              <MobileMenuContent user={user} handleLogout={handleLogout} NavLinks={NavLinks} />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

const MobileMenuContent = ({ user, handleLogout, NavLinks }) => {
  const navigate = useNavigate();
  const sheetContext = React.useContext(SheetContext);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-10 p-2 rounded-2xl bg-zinc-900/50">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <User className="w-6 h-6 text-black" />
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-base truncate">{user.name || 'Account'}</p>
          <p className="text-xs text-zinc-400 capitalize">{user.role?.replace('ROLE_', '').toLowerCase() || 'Guest'}</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] px-3">Main Menu</p>
        <div className="flex flex-col space-y-1">
          <NavLinks variant="mobile" />
          {user.role && (
            <Link 
              to="/profile" 
              onClick={() => sheetContext?.setOpen(false)}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            >
              Profile Settings
            </Link>
          )}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-zinc-800">
        {user.role ? (
            <Button 
              onClick={() => {
                sheetContext?.setOpen(false);
                handleLogout();
              }} 
              className="w-full rounded-2xl bg-white text-black hover:bg-zinc-200 h-12 font-bold transition-all active:scale-95"
            >
              Logout
            </Button>
        ) : (
            <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full h-11 rounded-2xl font-bold border-zinc-800 hover:bg-zinc-900 text-white" onClick={() => navigate('/login')}>Login</Button>
                <Button className="w-full h-11 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold" onClick={() => navigate('/register')}>Join SkillBridge</Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;