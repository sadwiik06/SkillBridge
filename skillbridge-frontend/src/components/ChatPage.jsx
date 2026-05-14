"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import SockJS from "sockjs-client";
import Stomp from 'stompjs';
import { Send, MessageCircle, LogOut, ChevronLeft, ChevronDown, ChevronRight, Briefcase } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BACKEND_URL = "http://localhost:8080";
const SOCKET_URL = `${BACKEND_URL}/ws-skillbridge`;

export default function ChatPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialContact = location.state?.contact || null;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeContact, setActiveContact] = useState(initialContact);
    const activeContactRef = useRef(activeContact);
    const [activeRoomId, setActiveRoomId] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [expandedProjects, setExpandedProjects] = useState({});

    const stompClient = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) { navigate('/login'); return; }
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        if (!currentUser) return;
        fetchContacts(currentUser);
    }, [currentUser]);

    const fetchContacts = async (user) => {
        try {
            let contactList = [];

            if (user.role === 'ROLE_FREELANCER') {
                const res = await axios.get(`${BACKEND_URL}/api/projects/my-work`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                contactList = res.data
                    .filter(p => p.client)
                    .map(p => ({
                        id: p.client.id,
                        name: p.client.name,
                        projectId: p.id,
                        projectTitle: p.title,
                        role: 'CLIENT',
                    }));
            } else if (user.role === 'ROLE_CLIENT') {
                const res = await axios.get(`${BACKEND_URL}/api/projects/my-projects`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                contactList = res.data
                    .filter(p => p.freelancer && (p.status === 'IN_PROGRESS' || p.status === 'SUBMITTED' || p.status === 'COMPLETED'))
                    .map(p => ({
                        id: p.freelancer.id,
                        name: p.freelancer.name,
                        projectId: p.id,
                        projectTitle: p.title,
                        role: 'FREELANCER',
                    }));
            }

            const seen = new Set();
            const unique = contactList.filter(c => {
                const key = `${c.id}-${c.projectId}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            setContacts(unique);

            if (initialContact) {
                openChat(initialContact, user);
            }
        } catch (err) {
            console.error("Failed to fetch contacts", err);
        }
    };

    const openChat = async (contact, user) => {
        const me = user || currentUser;
        setActiveContact(contact);

        const clientId  = me.role === 'ROLE_CLIENT'     ? me.id : contact.id;
        const freelancerId = me.role === 'ROLE_FREELANCER' ? me.id : contact.id;
        const projectId = contact.projectId;

        const roomId = `${projectId}-${Math.min(clientId, freelancerId)}-${Math.max(clientId, freelancerId)}`;
        setActiveRoomId(roomId);

        setExpandedProjects(prev => ({ ...prev, [projectId]: true }));

        try {
            const res = await axios.get(`${BACKEND_URL}/api/messages/${projectId}/${clientId}/${freelancerId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessages(res.data || []);
        } catch {
            setMessages([]);
        }
    };

    useEffect(() => {
        activeContactRef.current = activeContact;
    }, [activeContact]);

    useEffect(() => {
        if (!currentUser) return;

        const socket = new SockJS(SOCKET_URL);
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = null;

        stompClient.current.connect({}, () => {
            setConnected(true);
            stompClient.current.subscribe(`/topic/messages/${currentUser.id}`, (payload) => {
                const msg = JSON.parse(payload.body);
                setMessages(prev => {
                    const currentContact = activeContactRef.current;
                    if (currentContact && (
                        (msg.senderId === currentContact.id && msg.recipientId === currentUser.id) ||
                        (msg.senderId === currentUser.id && msg.recipientId === currentContact.id)
                    ) && (
                        msg.chatRoom?.project?.id === currentContact.projectId || msg.projectId === currentContact.projectId
                    )) {
                        return [...prev, msg];
                    }
                    return prev;
                });
            });
        }, (err) => {
            console.error("Socket error:", err);
            setConnected(false);
        });

        return () => { if (stompClient.current) stompClient.current.disconnect(); };
    }, [currentUser?.id]);


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !connected || !activeContact) return;

        const chatMessage = {
            senderId: currentUser.id,
            recipientId: activeContact.id,
            projectId: activeContact.projectId,
            content: input,
            timestamp: new Date().toISOString(),
        };

        stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        setMessages(prev => [...prev, chatMessage]);
        setInput("");
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const groupedContacts = contacts.reduce((acc, contact) => {
        const pId = contact.projectId;
        if (!acc[pId]) {
            acc[pId] = {
                projectId: pId,
                projectTitle: contact.projectTitle,
                contacts: []
            };
        }
        acc[pId].contacts.push(contact);
        return acc;
    }, {});

    const toggleProject = (projectId) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    const userRole = currentUser?.role;

    return (
        <div className="flex h-[calc(100vh-72px)] bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans text-gray-900 dark:text-gray-100 relative">
            
            {/* ── Left Sidebar ── */}
            <div className={cn(
                "w-full md:w-80 flex-shrink-0 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col transition-all duration-300",
                activeContact ? "hidden md:flex" : "flex"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-base">
                            {currentUser?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                            <p className="font-bold text-sm leading-none">{currentUser?.name}</p>
                            <p className="text-[11px] text-green-500 font-semibold mt-0.5">Online</p>
                        </div>
                    </div>
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2">
                    {Object.keys(groupedContacts).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4 opacity-60">
                            <MessageCircle className="w-10 h-10 text-gray-300 mb-3" />
                            <p className="text-sm font-semibold text-gray-500">No conversations yet</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {userRole === 'ROLE_FREELANCER'
                                    ? 'Start a conversation by bidding on a project'
                                    : 'Conversations appear after you hire a freelancer'}
                            </p>
                        </div>
                    ) : (
                        Object.values(groupedContacts).map(group => {
                            const isExpanded = expandedProjects[group.projectId];
                            return (
                                <div key={group.projectId} className="space-y-1 mb-3">
                                    <button 
                                        onClick={() => toggleProject(group.projectId)}
                                        className={cn(
                                            "w-full px-4 py-2.5 flex items-center justify-between transition-all duration-200 group border rounded-xl shadow-sm",
                                            isExpanded 
                                                ? "bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" 
                                                : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="text-left overflow-hidden">
                                                <p className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest leading-none mb-1",
                                                    isExpanded ? "text-indigo-500" : "text-zinc-400"
                                                )}>Project</p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                                                    {group.projectTitle}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300",
                                            isExpanded ? "rotate-180 bg-zinc-200/50 dark:bg-zinc-700/50" : "bg-transparent"
                                        )}>
                                            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                                        </div>
                                    </button>
                                    
                                    {isExpanded && (
                                        <div className="pl-1 space-y-1">
                                            {group.contacts.map((contact, idx) => {
                                                const isActive = activeContact?.id === contact.id && activeContact?.projectId === contact.projectId;
                                                return (
                                                    <button
                                                        key={`${contact.id}-${contact.projectId}-${idx}`}
                                                        onClick={() => openChat(contact, currentUser)}
                                                        className={cn(
                                                            "w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left",
                                                            isActive
                                                                ? "bg-black text-white"
                                                                : "hover:bg-gray-50 dark:hover:bg-zinc-800"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                                                            isActive ? "bg-white/20 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600"
                                                        )}>
                                                            {contact.name?.[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-xs truncate">{contact.name}</p>
                                                            <p className={cn("text-[10px] truncate mt-0.5", isActive ? "text-gray-300" : "text-gray-400")}>
                                                                {userRole === 'ROLE_CLIENT' ? 'Freelancer' : 'Client'}
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })

                    )}
                </div>
            </div>

            {/* ── Main Chat Area ── */}
            <div className={cn(
                "flex-1 flex flex-col bg-white dark:bg-zinc-950 transition-all duration-300",
                !activeContact ? "hidden md:flex" : "flex"
            )}>
                {activeContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 flex-shrink-0 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
                            <div className="flex items-center gap-2 md:gap-3">
                                {/* Mobile Back Button */}
                                <button 
                                    onClick={() => setActiveContact(null)}
                                    className="md:hidden p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                
                                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs md:text-sm">
                                    {activeContact.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{activeContact.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{activeContact.projectTitle}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", connected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-400")} />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    {connected ? "Secure" : "Reconnecting..."}
                                </span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                                        <MessageCircle className="w-7 h-7" />
                                    </div>
                                    <p className="text-sm font-semibold">No messages yet</p>
                                    <p className="text-xs text-gray-500 mt-1">Start the conversation with {activeContact.name}</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = String(msg.senderId) === String(currentUser?.id);
                                    return (
                                        <div key={idx} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                                            <div className={cn(
                                                "max-w-[72%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                                                isMe
                                                    ? "bg-black text-white rounded-tr-none"
                                                    : "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
                                            )}>
                                                <p className="leading-relaxed">{msg.content}</p>
                                                <p className={cn("text-[9px] mt-1 opacity-60", isMe ? "text-right" : "text-left")}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-black/5 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={`Message ${activeContact.name}...`}
                                    className="flex-1 bg-transparent border-0 px-3 py-2 text-sm focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || !connected}
                                    className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                            <p className="text-[10px] text-center text-gray-400 mt-2 tracking-tight uppercase font-medium">
                                End-to-end encrypted · SkillBridge
                            </p>
                        </div>
                    </>
                ) : (
                    /* ── Empty state ── */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mb-6">
                            <MessageCircle className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {userRole === 'ROLE_FREELANCER' ? 'Your Project Chats' : 'Freelancer Chats'}
                        </h3>
                        <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
                            {userRole === 'ROLE_FREELANCER'
                                ? contacts.length > 0
                                    ? 'Select a conversation from the left to start messaging.'
                                    : 'You have no active conversations yet. Bid on a project and get hired to start chatting with a client.'
                                : contacts.length > 0
                                    ? 'Select a conversation from the left to start messaging.'
                                    : "You haven't hired a freelancer yet. Once you accept a bid, you can message them here."
                            }
                        </p>
                    </div>
                )}
            </div>

            <style>{`
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 10px; }
            `}</style>
        </div>
    );
}
