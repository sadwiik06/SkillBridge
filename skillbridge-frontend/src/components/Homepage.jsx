import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container" style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to SkillBridge</h1>
      <p>Connect with top talent or find your next project.</p>
      <div className="buttons" style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/login')} 
          style={{ marginRight: '10px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Login
        </button>
        <button 
          onClick={() => navigate('/register')} 
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Homepage;
