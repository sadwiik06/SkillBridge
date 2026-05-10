import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get(`/auth/profile/${id}`);
                setProfile(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load public profile", err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div style={{ padding: '20px' }}>Loading profile...</div>;
    if (!profile) return <div style={{ padding: '20px' }}>User not found. <button onClick={() => navigate(-1)}>Go Back</button></div>;

    const isFreelancer = profile.role === 'ROLE_FREELANCER';

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '15px' }}>← Back</button>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>👤</div>
                <h2 style={{ margin: '0 0 5px 0' }}>{profile.name}</h2>
                <span style={{ display: 'inline-block', padding: '3px 8px', backgroundColor: '#e9ecef', borderRadius: '12px', fontSize: '0.9em' }}>
                    {profile.role.replace('ROLE_', '')}
                </span>
            </div>
            
            <hr style={{ margin: '20px 0' }} />
            
            {isFreelancer ? (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h4>Rating</h4>
                    <p style={{ color: '#f39c12', fontSize: '1.2em', margin: '5px 0' }}>
                        {"★".repeat(Math.round(profile.averageRating || 0))}
                        {"☆".repeat(5 - Math.round(profile.averageRating || 0))}
                    </p>
                    <span style={{ color: '#666' }}>({profile.totalReviews || 0} reviews)</span>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px', textAlign: 'center' }}>
                    <div>
                        <h4 style={{ margin: '0', fontSize: '0.85em', color: '#666' }}>Total Posted</h4>
                        <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '5px 0' }}>{profile.projectsPosted || 0}</p>
                    </div>
                    <div>
                        <h4 style={{ margin: '0', fontSize: '0.85em', color: '#666' }}>Hire Rate %</h4>
                        <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '5px 0', color: (profile.hireRate > 70 ? '#28a745' : '#f39c12') }}>
                            {Math.round(profile.hireRate || 0)}%
                        </p>
                    </div>
                    <div>
                        <h4 style={{ margin: '0', fontSize: '0.85em', color: '#666' }}>Total Spent</h4>
                        <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '5px 0', color: '#007bff' }}>
                            ₹{Math.round(profile.totalSpent || 0)}
                        </p>
                    </div>
                    <div>
                        <h4 style={{ margin: '0', fontSize: '0.85em', color: '#666' }}>Active Escrow</h4>
                        <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '5px 0', color: '#6f42c1' }}>
                            ₹{Math.round(profile.lockedBalance || 0)}
                        </p>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <h3>About</h3>
                <p style={{ whiteSpace: 'pre-wrap', color: profile.bio ? '#333' : '#999' }}>
                    {profile.bio || 'No bio provided.'}
                </p>
            </div>

            {isFreelancer && (
                <div>
                    <h3>Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map(skill => (
                                <span key={skill} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', borderRadius: '15px', fontSize: '0.9em' }}>
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p style={{ color: '#999' }}>No skills listed.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicProfile;
