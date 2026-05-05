import React,{useState,useEffect} from "react";
import API from '../api/axios';
const CreateProject = ()=>{
    const [formData,setFormData]=useState({
        title:"",
        description:"",
        budget: '',
        category:'WEB_DEVELOPMENT'
    });
    const [availableBalance,setAvailableBalance]=useState(0);
    const categories = [
        "WEB_DEVELOPMENT",
        "MOBILE_APP",
        "CONTENT_WRITING",
        "GRAPHIC_DESIGN",
        "DIGITAL_MARKETING",
        "VIDEO_EDITING",
        "DATA_ENTRY",
        "UI_UX_DESIGN",
        "SEO_SPECIALIST",
        "AI_ML_DEVELOPMENT"
    ];
    useEffect(()=>{
        const fetchUserData = async()=>{
            const res= await API.get('/auth/me');
            setAvailableBalance(res.data.totalBalance- res.data.lockedBalance);
        };
        fetchUserData();
    },[]);
    const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})

    };
    const handleSubmit=async(e)=>{
        e.preventDefault();

    
        //if budget exceeds open funds
        if(parseFloat(formData.budget)>availableBalance){
            alert("Insufficient funds! Please allocate more money in your wallet first");
            return;
        }
        try{
            await API.post('/projects/create',formData);
            alert("Project posted and funds locked");
            setFormData({
                title:"",
                description:"",
                budget:"",
                category:"WEB_DEVELOPMENT"
            })
        }
        catch(err){
            alert("Failed to create project")
        }
    };
    return(
        <div style={{padding:'20px'}}>
            <h2>Post a new Task</h2>
            <p>Available Funds: <strong>${availableBalance}</strong></p>
            <form onSubmit={handleSubmit}>
                <input name="title"
                placeholder="Project Title"
                onChange={handleChange}
                required/>
                <textarea name="description"
                placeholder="Describe the requirements or the task.." 
                onChange={handleChange}
                rows="5"
                required />
                <select name="category" onChange={handleChange} value={formData.category}>
                    {categories.map(cat=>(
                        <option key={cat} value={cat}>
                            {cat.replace('_',' ')}
                        </option>
                    ))}
                </select>
                <input name="budget" type="number" placeholder="Budget"
                onChange={handleChange}
                required/>
                {formData.budget > availableBalance && (
                    <span style={{color: 'red'}}>
                        Budget Exceeds availble funds
                    </span>
                )}
                <button type="submit">Post Project</button>

            </form>
        </div>
    )
    
}