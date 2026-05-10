import React,{useState,useEffect} from "react";
import API from '../api/axios';
const MyWork = ()=>{
    const [workList,setWorkList]=useState([]);
    const [submission,setSubmission]=useState({url:'',comment:''});
    const handleSubmitWork=async(projectId)=>{
        try{
            await API.post(`/projects/${projectId}/submit`,submission);
            alert("Project submitted for review!");
            window.location.reload();
        } catch(err){
            alert("Submission failed");
        }
    };
    const handleSubmitMilestoneWork=async(milestoneId)=>{
        try{
            await API.post(`/projects/milestones/${milestoneId}/submit`, submission);
            alert("Milestone work submitted for review!");
            window.location.reload();
        } catch(err){
            alert("Submission failed");
        }
    };
    useEffect(()=>{
        const fetchWork=async()=>{
            const res=await API.get('/projects/my-work');
            setWorkList(res.data);
        };
        fetchWork();
    },[]);
    return (
        <div>
            <h2>My Jobs</h2>
            <div>
                {workList.length===0?<p>No jobs found.</p>:(
                    workList.map(proj=>(
                        <div key={proj.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
                            <h3>{proj.title}</h3>
                            <p><strong>Client:</strong> {proj.client?.name || 'Unknown'}</p>
                            <p><strong>Payment:</strong>{proj.budget}</p>
                            <p><strong>Status:</strong>
                            <span style={{color:proj.status==='COMPLETED'?'green':'orange'}}>
                                {proj.status}
                            </span>
                            </p>
                            {proj.milestones && proj.milestones.length > 0 && (
                                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                                    <h4>Project Milestones:</h4>
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        {proj.milestones.map(m => (
                                            <li key={m.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                                                <strong>{m.title}</strong> - ${m.amount}
                                                <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#555' }}>{m.description}</p>
                                                
                                                <span style={{
                                                    fontSize: '0.8em', padding: '2px 6px', borderRadius: '4px',
                                                    backgroundColor: m.status === 'COMPLETED' ? '#d4edda' : m.status === 'SUBMITTED' ? '#fff3cd' : '#e2e3e5'
                                                }}>
                                                    Status: {m.status}
                                                </span>

                                                {proj.status === 'IN_PROGRESS' && m.status === 'PENDING' && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <input placeholder="GitHub repo / Link to work"
                                                        onChange={(e)=>setSubmission({...submission, url:e.target.value})}
                                                        style={{ width: '100%', marginBottom: '5px' }}
                                                        />
                                                        <input placeholder="Add a comment or description..."
                                                        onChange={(e)=>setSubmission({...submission, comment:e.target.value})}
                                                        style={{ width: '100%', marginBottom: '5px' }}
                                                        />
                                                        <button onClick={()=>handleSubmitMilestoneWork(m.id)}>Submit Proof of Work</button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {(!proj.milestones || proj.milestones.length === 0) && proj.status==='IN_PROGRESS' && (
                                <div style={{ marginTop: '10px' }}>
                                    <input placeholder="Github repo/Link to work"
                                    onChange={(e)=>setSubmission({...submission,url:e.target.value})}
                                    style={{ width: '100%', marginBottom: '5px' }}
                                    />
                                    <input placeholder="Add a comment..."
                                    onChange={(e)=>setSubmission({...submission, comment:e.target.value})}
                                    style={{ width: '100%', marginBottom: '5px' }}
                                    />
                                    <button onClick={()=>handleSubmitWork(proj.id)}>Submit Proof of Work</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
    
}
export default MyWork;