import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const [myBids,setMyBids]=useState([]);
    const fetchProjects=async()=>{
        try{
            const url=category? `/projects/search?category=${category}`: '/projects/search';
            const res=await API.get(url);
            setProjects(res.data);
        }catch(err){
            console.error("Error fetching projects");
        }

    };
    const fetchMyBids=async()=>{
        try{
            const res=await API.get('/bids/my-bids');
            setMyBids(res.data);
        } catch(err){
            console.error("Error fetching my bids");
        }
    }
    useEffect(()=>{
        fetchProjects();
        fetchMyBids();
    },[category]);

    const handleBidSubmit=async(e)=>{
        e.preventDefault();
        try{
            await API.post(`/bids/place?projectId=${selectedProject.id}`,bidData);
            alert("Bid placed successfully!");
            setSelectedProject(null);
            fetchMyBids(); // Refresh bids after placing one

        } catch(err){
            alert("Failed to place Bid.");
        }
    }

    const hasAlreadyBidded = (projectId) => {
        return myBids.some(bid => bid.project.id === projectId);
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
                {(!Array.isArray(projects) || projects.length === 0) ? <p>No projects found.</p> : projects.map((proj) => (
                    <div key={proj.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px' }}>
                        <h3>{proj.title}</h3>
                        {proj.client && (
                            <p style={{ fontSize: '0.9em', color: '#555' }}>
                                Posted by: <Link to={`/profile/${proj.client.id}`} style={{ textDecoration: 'underline', color: 'blue' }}>{proj.client.name}</Link>
                            </p>
                        )}
                        <p>{proj.description}</p>
                        <p>Budget: <strong>${proj.budget}</strong> | Category : {proj.category}</p>
                        
                        {proj.milestones && proj.milestones.length > 0 && (
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                                <h4>Project Milestones:</h4>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {proj.milestones.map(m => (
                                        <li key={m.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '5px' }}>
                                            <strong>{m.title}</strong> - ${m.amount}
                                            <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#555' }}>{m.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {hasAlreadyBidded(proj.id) ? (
                            <button disabled style={{ backgroundColor: '#ccc', cursor: 'not-allowed', marginTop: '10px' }}>Applied</button>
                        ) : (
                            <button onClick={()=>setSelectedProject(proj)} style={{ marginTop: '10px' }}>Apply for this project</button>
                        )}
                    </div>
                ))}
            </div>
            {selectedProject && (
                <div style={{ marginTop: '20px', border: '2px solid #000', padding: '15px' }}>
                    <h3>Apply for: {selectedProject.title}</h3>
                    {selectedProject.milestones && selectedProject.milestones.length > 0 ? (
                        <p><em>The budget for this project is fixed at ${selectedProject.budget} across milestones.</em></p>
                    ) : (
                        <p><em>The client has set a budget of ${selectedProject.budget}. You can bid your own amount.</em></p>
                    )}
                    
                    <form onSubmit={handleBidSubmit}>
                        {(!selectedProject.milestones || selectedProject.milestones.length === 0) && (
                            <input 
                                type="number"
                                placeholder="Your Bid Amount ($)"
                                onChange={(e)=>setBidData({...bidData, bidAmount: e.target.value})}
                                style={{ width: '100%', marginBottom: '10px' }}
                                required 
                            />
                        )}
                        <textarea placeholder='Why should we hire you? Describe your relevant experience...'
                        onChange={(e)=>setBidData({...bidData, proposalMessage:e.target.value})}
                        style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
                        required/>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit">Send Proposal</button>
                            <button type="button" onClick={()=>setSelectedProject(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default BrowseProjects;