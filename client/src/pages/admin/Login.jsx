import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLock, FiUser } from 'react-icons/fi';
import './Admin.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <img src="/logo.png" alt="Vantaigo" className="login-logo" />
        <h2>Admin Login</h2>
        <p>Sign in to manage your website content</p>
        <form onSubmit={handleSubmit} id="admin-login-form">
          <div className="form-group">
            <label><FiUser /> Username</label>
            <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" required />
          </div>
          <div className="form-group">
            <label><FiLock /> Password</label>
            <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required />
          </div>
          {error && <div className="login-error">{error}</div>}
          <div style={{ textAlign: 'right', marginBottom: '1rem', marginTop: '-0.5rem' }}>
            <Link to="/admin/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
