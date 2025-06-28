import { useNavigate } from "react-router-dom";

const RouteType = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', paddingTop: '5rem', background: '#12172b', height: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Where would you like to travel?</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <button onClick={() => navigate('/long-distance')}>🚄 Long-Distance</button>    
        <button onClick={() => navigate('/commuter')}>🚉 Commuter Route</button>
      </div>
    </div>
  );
};

export default RouteType;