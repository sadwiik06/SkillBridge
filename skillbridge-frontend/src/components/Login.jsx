import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
            if(res.data.role === 'ROLE_CLIENT'){
                navigate('/client-dashboard');
            }else{
                navigate('/freelancer-dashboard');
            }

        } catch(error){
            alert("Login Failed:"+error.response?.data);
        }
    };
    return(
        <div className='login-container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" type = "email" placeholder = "Enter email" onChange={handleChange} required />
                <input name = "password" type= "password" placeholder="Password" onChange={handleChange} required />
                <button type= "submit">Login</button>
            </form>
        </div>
    )
}

export default Login;