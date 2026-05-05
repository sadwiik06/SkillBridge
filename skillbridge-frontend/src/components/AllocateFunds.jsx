import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const AllocateFunds = () => {
    const [amount,setAmount]=useState('');
    const [balance,setBalance]=useState({total:0,locked:0})
    const [loading,setLoading]=useState(false);
    const fetchBalance=async()=>{
        try{
            const res=await API.get('/auth/me');
            setBalance({
                total:res.data.totalBalance,
                locked:res.data.lockedBalance
            });

        }catch(err){
            console.error("Error fetching balance",err);
        }
    };
    useEffect(()=>{
        fetchBalance();
    },[]);
    const handleDeposit=async(e)=>{
        e.preventDefault();
        if(amount<=0) return alert("Enter a valid amount");
        setLoading(true);
        try{
            await API.post(`wallet/deposit?amount=${amount}`);
            alert("Funds allocated successfully!");
            setAmount('');
            fetchBalance();
        }catch(err){
            alert("Deposit failed: "+ (err.response?.data || "Server Error"));
        } finally{
            setLoading(false);
        }
    };
    return (
        <div style={{padding : '20px',border:'1px solid #ccc'}}>
            <h2>Wallet Management</h2>
            <div style={{marginBottom: '20px', background:'#f9f9f9',padding: '10px'}}>
                <p><strong>Total Balance:</strong>${balance.total}</p>
                <p><strong>Locked (Escrow):</strong>${balance.locked}</p>
                <p><strong>Available to Spend:</strong>${balance.total-balance.locked}</p>

            </div>
            <form onSubmit={handleDeposit}>
                <label>Amount to Add: </label>
                <input 
                type="number"
                value={amount}
                onChange={(e)=>setAmount(e.target.value)}
                placeholder='0.00'
                required/>
                <button type="submit" disabled={loading}>
                    {loading?"Processing...":"Allocate Funds"}
                </button>
            </form>
        </div>
    );
};

export default AllocateFunds;