import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
        alert("Regsitration successful! Please Login");
        navigate('/login');
    } catch(error){
        alert("Regsitration failed:" + (error.response?.data || "Server Error"))
    }
};
return(
    <div className='register-container'>
        <h2> Join SkillBridge</h2>
        <form onSubmit={handleSubmit}>
            <input name="name" type="text" placeholder="Enter your fullName" onChange={handleChange} required />
            <input 
                    name="email" 
                    type="email" 
                    placeholder="Email Address" 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    required 
                />
            <label> Register As:</label>
            <select name="role" onChange={handleChange} value={formData.role}>
                <option value="ROLE_CLIENT">Client (Hire Freelancer)</option>
                <option value="ROLE_FREELANCER">Freelancer (Find Work)</option>
            </select>
            <button type="submit">Create Account</button>
        </form>
    </div>
)
}
export default Register;