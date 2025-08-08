// src/pages/AdminLogin.jsx
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Fake JWT token for testing purposes
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                      "eyJleHAiOjQ3ODQyNDAwMDB9." +
                      "abc123fakeSignature";
    localStorage.setItem("adminToken", fakeToken);
    navigate("/admin");
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f4f4',
      fontFamily: 'sans-serif',
    }}>
      <h2>Admin Login</h2>
      <button 
        onClick={handleLogin} 
        style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}
      >
        Login as Admin
      </button>
    </div>
  );
};

export default AdminLogin;
