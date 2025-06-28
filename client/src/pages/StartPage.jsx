import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(to bottom right, #1e1f3f, #2a2759)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>PRASA</h1>
      <button
        onClick={() => navigate('/select')}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: '#5c6bc0',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#fff',
        }}
      >
        Start
      </button>
      <p style={{ marginTop: '1rem', opacity: 0.7 }}>Book your journey now</p>
    </div>
  );
}

export default StartPage;