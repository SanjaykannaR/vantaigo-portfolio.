import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './Admin.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await adminAPI.resetPassword(token, { password });
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset link. Please try generating a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <img src="/logo.png" alt="Vantaigo" className="login-logo" />
        <h2>Admin Panel</h2>
        <p>Password Reset</p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h2 style={{ color: '#3FB950', marginBottom: '0.5rem' }}>Password Reset Successfully!</h2>
            <p style={{ color: 'var(--text-muted)' }}>You can now use your new password. Redirecting to login...</p>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/admin/login" className="btn btn-outline" style={{display: 'inline-block', padding: '0.8rem 1.5rem'}}>Click here if not redirected</Link>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{marginTop: '1.5rem', marginBottom: '0.5rem'}}>Create New Password</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please enter and confirm your new admin password.</p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} id="admin-login-form">
              <div className="form-group">
                <label><FiLock /> New Password</label>
                <div className="input-icon-wrap" style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    disabled={loading}
                    autoFocus
                  />
                  <button type="button" className="input-icon-btn" onClick={() => setShowPassword(!showPassword)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label><FiLock /> Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retype password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Saving...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
