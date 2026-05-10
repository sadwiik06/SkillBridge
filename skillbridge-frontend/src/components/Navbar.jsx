import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from "react-router-dom"
import API from '../api/axios';

const Navbar = ({user: initialUser})=>{
    const navigate=useNavigate();
    const [user, setUser] = useState(initialUser);

    useEffect(() => {
        const fetchUserData = async () => {
            if (initialUser && initialUser.role) {
                try {
                    const res = await API.get('/auth/me');
                    setUser(res.data);
                    // Update localStorage so it stays fresh across hard reloads
                    localStorage.setItem('user', JSON.stringify(res.data));
                } catch (err) {
                    console.error("Failed to refresh user data for navbar", err);
                }
            }
        };
        fetchUserData();
    }, [initialUser.role]);

    const handleLogout=()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };
    return(
        <nav style={{ display: 'flex', gap: '15px', padding: '10px', background: '#eee', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
            <Link to="/">SkillBridge</Link>
            {user.role==='ROLE_CLIENT' && (
                <>
                <Link to="/client-dashboard">Dashboard</Link>
                <Link to="/post-task">Post a Task</Link>
                <Link to="/manage-projects">My Hire List</Link>
                <Link to="/allocate-funds">Add Funds</Link>
                <Link to="/wallet">Wallet & Transactions (₹{user.totalBalance})</Link>
                </>
            
            )}
            {user.role=== 'ROLE_FREELANCER' && (
                <>
                <Link to="/freelancer-dashboard">Dashboard</Link>
                <Link to="/browse">Browse Jobs</Link>
                <Link to="/my-projects">My Active Jobs</Link>
                <Link to="/wallet">Earning : ₹{user.totalBalance}</Link>
                </>
            )}
            {user.role && <Link to="/profile">Profile</Link>}
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default Navbar;