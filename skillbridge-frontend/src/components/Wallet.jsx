import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { cn } from "@/lib/utils";
import { Wallet as WalletIcon, Lock, ArrowUpRight, ArrowDownLeft, Clock, Search, IndianRupee, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const Badge = ({
  children,
  variant,
}) => {
  const styles =
    variant === 'success'
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      : variant === 'danger'
      ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'

  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border', styles)}>
      {children}
    </span>
  )
}

const Wallet = () => {
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState({ total: 0, locked: 0 });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const txRes = await API.get('/transactions/my-transactions');
                setTransactions(txRes.data);

                const userRes = await API.get('/auth/me');
                setUser(userRes.data);
                setBalance({
                    total: userRes.data.totalBalance || 0,
                    locked: userRes.data.lockedBalance || 0
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching wallet data", err);
                setLoading(false);
            }
        };
        fetchWalletData();
    }, []);

    const getTransactionVariant = (type) => {
        if (type.includes('DEPOSIT') || type.includes('RELEASE')) return 'success';
        if (type.includes('WITHDRAWAL') || type.includes('LOCK')) return 'danger';
        return 'warning';
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

    const isFreelancer = user?.role === 'ROLE_FREELANCER';

    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        {isFreelancer ? "Earnings & Payments" : "Digital Wallet"}
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        {isFreelancer 
                            ? "Track your total earnings and payment history." 
                            : "Monitor your earnings, escrow locks, and payment history."}
                    </p>
                </div>
            </div>


            {/* Balance Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {!isFreelancer && (
                    <>
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <WalletIcon className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Available Balance</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-zinc-900 dark:text-white">₹{(balance.total - balance.locked).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <Lock className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Locked in Escrow</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-zinc-900 dark:text-white">₹{balance.locked.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className={cn(
                    "rounded-[2.5rem] p-8 border border-transparent shadow-xl relative overflow-hidden group",
                    isFreelancer ? "bg-emerald-500 text-white lg:col-span-1" : "bg-black dark:bg-white text-white dark:text-black"
                )}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-black/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center",
                                isFreelancer ? "bg-white/20" : "bg-white/20 dark:bg-black/10"
                            )}>
                                <IndianRupee className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {isFreelancer ? "Total Earnings" : "Total Balance"}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black">₹{balance.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Add Funds Section - Only for Clients */}
            {!isFreelancer && (
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-12">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <ArrowUpRight className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Quick Deposit</h3>
                                <p className="text-xs text-zinc-500">Top up your wallet to start hiring freelancers instantly.</p>
                            </div>
                        </div>
                        
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const amount = e.target.amount.value;
                            if (!amount || amount <= 0) return;
                            try {
                                await API.post(`/wallet/deposit?amount=${amount}`);
                                alert("Funds added successfully!");
                                window.location.reload();
                            } catch (err) {
                                alert("Failed to add funds. Check backend implementation.");
                            }
                        }} className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-48">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
                                <input 
                                    name="amount"
                                    type="number" 
                                    placeholder="Amount" 
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-14 pl-8 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <Button type="submit" className="h-14 px-8 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-xs">
                                Add Funds
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Transaction Table Card */}
            <section className="bg-white dark:bg-zinc-900 shadow-2xl rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden ring-1 ring-zinc-950/5">
                {/* Table Header */}
                <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                            <History className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Transactions</h2>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1">Audit Log</p>
                        </div>
                    </div>
                </div>

                {/* Table wrapper for responsive overflow */}
                <div className="overflow-x-auto">
                    <table className="min-w-[640px] w-full border-collapse text-sm">
                        <thead className="bg-zinc-50/50 dark:bg-zinc-800/30">
                            <tr className="text-zinc-400 *:text-left *:px-8 *:py-4 *:text-[10px] *:font-black *:uppercase *:tracking-widest">
                                <th className="w-16">#</th>
                                <th className="min-w-[120px]">Date</th>
                                <th className="min-w-[140px]">Type</th>
                                <th className="min-w-[300px]">Description</th>
                                <th className="min-w-[140px] text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-zinc-400 italic">
                                        No transactions recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx, idx) => (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group"
                                    >
                                        <td className="px-8 py-4 text-[10px] font-bold text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{idx + 1}</td>
                                        <td className="px-8 py-4 whitespace-nowrap text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                            {new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-4">
                                            <Badge variant={getTransactionVariant(tx.type)}>
                                                {tx.type.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "size-8 rounded-lg flex items-center justify-center shrink-0",
                                                    tx.amount > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                                )}>
                                                    {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                                </div>
                                                <span className="text-zinc-800 dark:text-zinc-200 font-bold">{tx.description}</span>
                                            </div>
                                        </td>
                                        <td className={cn(
                                            "px-8 py-4 text-right font-black tabular-nums text-base",
                                            tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-white"
                                        )}>
                                            {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 px-8 py-5 bg-zinc-50/30 dark:bg-zinc-800/10">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Showing <strong className="text-zinc-900 dark:text-white">{transactions.length}</strong> {transactions.length === 1 ? 'record' : 'records'}
                    </span>
                </div>
            </section>
        </div>
    );
};

export default Wallet;