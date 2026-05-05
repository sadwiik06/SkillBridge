import React, { useState, useEffect } from 'react';
import API from '../api/axios';
const BrowseProjects=()=>{
    const [projects,setProjects]=useState([]);
    const [category,setCategory]=useState('');
    const [selectedProject,setSelectedProject]=useState(null);
    const [bidData,setBidData] = useState({bidAmount:'',proposalMessage:''});
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
    const fetchProjects=async()=>{
        try{
            const url=category? `/projects/search?category=${category}`: '/projects/search';
            const res=await API.get(url);
            setProjects(res.data);
        }catch(err){
            console.error("Error fetching projects");
        }

    };
    useEffect(()=>{
        fetchProjects();

    },[category]);
    const handleBidSubmit=async(e)=>{
        e.preventDefault();
        try{
            await API.post(`/bids/place/?projectId=${selectedProject.id}`,bidData);
            alert("Bid placed successfully!");
            setSelectedProject(null);

        } catch(err){
            alert("Failed to place Bid.");
        }

    }
    return (
        <div style={{padding: '20px'}}>
            <h2>Available Projects</h2>
            <div style={{marginBottom:'20px'}}>
                <button onClick={()=>setCategory()}>All</button>
                {categories.map((cat)=>(
                    <button key={cat} onClick={()=>setCategory(cat)}>
                        {cat.replace('_',' ')}
                    </button>
                ))}
            </div>
            <div style={{display:'grid'}}>
                {projects.map((proj) => (
                    <div key={proj.id} >
                        <h3>{proj.title}</h3>
                        <p>{proj.description}</p>
                        <p>Budget: <strong>${proj.budget}</strong> | Category : {proj.category}</p>
                        <button onClick={()=>setSelectedProject(proj)}>Apply for this project</button>
                    </div>
                ))}
            </div>
            {selectedProject && (
                <div>
                    <h3>Apply for: {selectedProject.title}</h3>
                    <form onSubmit={handleBidSubmit}>
                        <input 
                        type="number"
                        placeholder="Your Bid Amount ($)"
                        onChange={(e)=>setBidData({...bidData,bidAmount:e.target.value})} required />
                        <textarea placeholder='Why Should we hire you??'
                        onChange={(e)=>setBidData({...bidData, proposalMessage:e.target.value})}
                        required/>
                        <button type="submit">Send Proposal</button>
                        <button type="button" onClick={()=>setSelectedProject(null)}>Cancel</button>

                    </form>
                </div>
            )}
        </div>
    )
}

export default BrowseProjects;