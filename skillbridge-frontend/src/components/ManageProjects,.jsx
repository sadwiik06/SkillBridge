import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ReviewForm from './ReviewForm';

const ManageProjects = () => {
    const [myProjects, setMyProjects] = useState([]);
    const [selectProjectBids, setSelectedProjectBids] = useState([]);
    const [viewingBidsFor, setViewingBidsFor] = useState(null);

    useEffect(() => {
        const fetchmyprojects = async () => {
            try {
                const res = await API.get(`/projects/my-projects`);
                setMyProjects(res.data);
            } catch (err) {
                console.error("Error fetching your projects");
            }
        };
        fetchmyprojects();
    }, []);

    const handleViewBids = async (projectId) => {
        try {
            const res = await API.get(`/bids/project/${projectId}`);
            setSelectedProjectBids(res.data);
            setViewingBidsFor(projectId);
        } catch (err) {
            alert("Error loading bids");
        }
    };

    const handleAccepted = async (bidId) => {
        try {
            await API.post(`/bids/accept/${bidId}`);
            alert("Bid Accepted! Freelancer hired");
            setViewingBidsFor(null);
            // Refresh the list or update state instead of full reload
            window.location.reload();
        } catch (err) {
            alert("failed to accept bid");
        }
    };
    const handleReleaseFunds=async(projectId)=>{
        try{
            await API.post(`/projects/${projectId}/release`);
            alert("Payment released. Project completed");
            window.location.reload();
        } catch(err){
            alert("Failed to release funds");
        }
    }

    const handleReleaseMilestoneFunds = async (milestoneId) => {
        try {
            await API.post(`/projects/milestones/${milestoneId}/release`);
            alert("Milestone approved and funds released!");
            window.location.reload();
        } catch (err) {
            alert("Failed to release milestone funds");
        }
    };

    return (
        <div>
            <h2>My Projects</h2>
            <div className="projects-list">
                {(!Array.isArray(myProjects) || myProjects.length === 0) ? <p>No projects found.</p> : myProjects.map(proj => (
                    <div key={proj.id} className="project-card" style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd' }}>
                        <h3>{proj.title} (Status: {proj.status})</h3>
                        <p>Budget: ${proj.budget}</p>
                        {proj.status === 'OPEN' && (
                            <button onClick={() => handleViewBids(proj.id)}>View Bids</button>
                        )}
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

                                            {m.status === 'SUBMITTED' && m.submissionUrl && (
                                                <div style={{ marginTop: '10px', padding: '10px', border: '1px dashed #ccc' }}>
                                                    <p><strong>Work Submitted!</strong></p>
                                                    <p>Link: <a href={m.submissionUrl} target="_blank" rel="noreferrer">{m.submissionUrl}</a></p>
                                                    <p><em>{m.submissionComment}</em></p>
                                                    <button onClick={() => handleReleaseMilestoneFunds(m.id)} style={{ marginTop: '5px', backgroundColor: '#28a745', color: 'white' }}>
                                                        Approve Milestone & Release ${m.amount}
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(!proj.milestones || proj.milestones.length === 0) && proj.status === 'IN_PROGRESS' && proj.submissionUrl && (
                            <div style={{ marginTop: '10px', padding: '10px', border: '1px dashed #ccc' }}>
                                <p><strong>Freelancer submitted work!</strong></p>
                                <p>Link: <a href={proj.submissionUrl} target="_blank" rel="noreferrer">{proj.submissionUrl}</a></p>
                                <p><em>{proj.submissionComment}</em></p>
                                <button onClick={()=> handleReleaseFunds(proj.id)} style={{ backgroundColor: '#28a745', color: 'white' }}>Approve & Release Funds</button>
                            </div>
                        )}
                        
                        {proj.status === 'COMPLETED' && (
                            <div style={{ marginTop: '10px' }}>
                                <p style={{ color: 'green', fontWeight: 'bold' }}>Project Completed & Funds Released</p>
                                {!proj.reviewed ? (
                                    <ReviewForm
                                        projectId={proj.id}
                                        onReviewSubmitted={() => window.location.reload()}
                                    />
                                ) : (
                                    <p>Review Submitted</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {viewingBidsFor && (
                <div className="bids-modal" style={{ marginTop: '20px', border: '2px solid #000', padding: '15px' }}>
                    <h3>Bids for Project ID: {viewingBidsFor}</h3>
                    {selectProjectBids.length === 0 ? <p>No bids yet</p> : (
                        selectProjectBids.map(bid => (
                            <div key={bid.id} style={{ borderBottom: '1px solid #ccc', padding: '5px' }}>
                                <p><strong>Freelancer:</strong> <Link to={`/profile/${bid.freelancer?.id}`} style={{ textDecoration: 'underline', color: 'blue' }}>{bid.freelancer?.name || 'Unknown'}</Link></p>
                                <p style={{color:'#f39c12'}}>
                                    {"★".repeat(Math.round(bid.freelancer?.averageRating || 0))}
                                    {"☆".repeat(5 - Math.round(bid.freelancer?.averageRating || 0))}
                                    <span style={{color: '#666'}}>
                                        {" "}({bid.freelancer?.totalReviews || 0} reviews)

                                    </span>
                                </p>
                                <p><strong>Offer:</strong> ${bid.bidAmount}</p>
                                <p><strong>Message:</strong> {bid.proposalMessage}</p>
                                <button onClick={() => handleAccepted(bid.id)}>Hire this Freelancer</button>
                            </div>
                        ))
                    )}
                    <button onClick={() => setViewingBidsFor(null)}>Close Bids</button>
                </div>
            )}
        </div>
    );
};

export default ManageProjects;