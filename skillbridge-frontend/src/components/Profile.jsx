import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState(new Set());
    const [bio,setBio]=useState("");
    const fetchProfile = async () => {
        try {
            const res = await API.get(`/auth/me`);
            setProfile(res.data);
            setBio(res.data.bio || "");
            if (res.data.skills) {
                setSelectedSkills(new Set(res.data.skills));
            }
        } catch (err) {
            console.error("Failed to load profile");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const toggleSkill = (skill) => {
        const newSet = new Set(selectedSkills);
        newSet.has(skill) ? newSet.delete(skill) : newSet.add(skill);
        setSelectedSkills(newSet);
    };

    const handleSave = async () => {
        try {
            await API.put('/auth/me/update', {
                bio: bio,
                skills: Array.from(selectedSkills)
            });
            setIsEditingSkills(false);
            fetchProfile();
        } catch (err) {
            alert("Save failed");
        }
    };

    if (!profile) return <div>Loading...</div>;

    const isFreelancer = profile.role === 'ROLE_FREELANCER';

    return (
        <>
            <div>
                <div>
                    <div>👤</div>
                    <h2>{profile.name}</h2>
                    <p>{profile.email}</p>
                    <span>{profile.role.replace('ROLE_', '')}</span>
                </div>
                <hr />
                <div>
                    <div>
                        <h4>Total Wallet</h4>
                        <p>${profile.totalBalance.toFixed(2)}</p>
                    </div>
                </div>
                {isFreelancer ? (
                    <div>
                        <h4>Rating</h4>
                        <p>{"★".repeat(Math.round(profile.averageRating || 0))}</p>
                        <span>({profile.totalReviews})</span>
                    </div>
                ) : (
                    <div>
                        <h4>Locked Funds</h4>
                        <p>${profile.lockedBalance.toFixed(2)}</p>
                    </div>
                )}
            </div>
            <div>
                <div style={editSection}>
                    <div>
                        <h3>Professional Profile</h3>
                        <button onClick={()=>setIsEditingSkills(!isEditingSkills)}>
                            {isEditingSkills?"Cancel":"Edit Profile"}
                        </button>
                    </div>
                    <div>
                        <label>About Me</label>
                        {isEditingSkills?(
                            <textarea value={bio} onChange={(e)=>setBio(e.target.value)}
                            placeholder='Describe your expertise..' />
                        ): (
                            <p>{profile.bio || 'No bio added'} </p>
                        )
                        }
                    </div>
                </div>

                {!isFreelancer && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px', textAlign: 'center', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
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
                            <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '5px 0', color: '#007bff' }}>₹{Math.round(profile.totalSpent || 0)}</p>
                        </div>
                        <div>
                            <h4 style={{ margin: '0', fontSize: '0.85em', color: '#666' }}>Active Escrow</h4>
                            <p style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '5px 0', color: '#6f42c1' }}>₹{Math.round(profile.lockedBalance || 0)}</p>
                        </div>
                    </div>
                )}

                {isFreelancer && (
                    <>
                        {isEditingSkills ? (
                            <div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                                    {AVAILABBLE_SKILLS.map(skill => (
                                        <span key={skill} 
                                            onClick={() => toggleSkill(skill)} 
                                            style={{ 
                                                cursor: 'pointer', 
                                                padding: '5px 10px', 
                                                borderRadius: '15px', 
                                                backgroundColor: selectedSkills.has(skill) ? '#007bff' : '#eee',
                                                color: selectedSkills.has(skill) ? 'white' : 'black'
                                            }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <button onClick={handleSave}>Update Skill Set</button> 
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                {profile.skills && profile.skills.length > 0 ? (
                                    profile.skills.map(skill => (
                                        <span key={skill} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', borderRadius: '15px' }}>
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p>No skills added</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

const AVAILABBLE_SKILLS = [
    "WEB_DEVELOPMENT",
    "MOBILE_APP",
    "DESIGN",
    "WRITING",
    "MARKETING",
    "DATA_SCIENCE",
    "SEO",
    "VIDEO_EDITING"
];

const editSection = {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px'
};

export default Profile;
