import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Homepage from './components/Homepage';
import ClientDashboard from './components/ClientDashboard';
import FreelancerDashboard from './components/FreelancerDashboard';
import Navbar from './components/Navbar';
import ReviewForm from './components/ReviewForm';
import MyWork from './components/MyWork';
import ManageProjects from './components/ManageProjects';
import CreateProject from './components/CreateProject';
import AllocateFunds from './components/AllocateFunds';
import BrowseProjects from './components/BrowseProjects';
import PublicProfile from './components/PublicProfile';
import Profile from './components/Profile';
import Wallet from './components/Wallet';
import ChatPage from './components/ChatPage';
import './App.css';
function LayoutWithNavbar({children}){
  const user=JSON.parse(localStorage.getItem('user'))||{role:'',totalBalance:0}
  return(
    <>
    <Navbar user={user}/>
    {children}
    </>
  );
}
function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/client-dashboard" element={<LayoutWithNavbar><ClientDashboard/></LayoutWithNavbar>} />
          <Route path="/allocate-funds" element={<LayoutWithNavbar><AllocateFunds/></LayoutWithNavbar>} />
          <Route path="/freelancer-dashboard" element={<LayoutWithNavbar><FreelancerDashboard /></LayoutWithNavbar>} />
          <Route path="/browse" element={<LayoutWithNavbar><BrowseProjects/></LayoutWithNavbar>}/>
          <Route path="/post-task" element={<LayoutWithNavbar><CreateProject/></LayoutWithNavbar>}/>
          <Route path="/manage-projects" element={<LayoutWithNavbar><ManageProjects/></LayoutWithNavbar>}/>
          <Route path="/my-projects" element={<LayoutWithNavbar><MyWork/></LayoutWithNavbar>}/>
          <Route path="/review" element={<LayoutWithNavbar><ReviewForm/></LayoutWithNavbar>}/>
          <Route path="/profile" element={<LayoutWithNavbar><Profile/></LayoutWithNavbar>}/>
          <Route path="/profile/:id" element={<LayoutWithNavbar><PublicProfile/></LayoutWithNavbar>}/>
          <Route path="/wallet" element={<LayoutWithNavbar><Wallet/></LayoutWithNavbar>}/>
          <Route path="/chat" element={<LayoutWithNavbar><ChatPage/></LayoutWithNavbar>}/>
          
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
