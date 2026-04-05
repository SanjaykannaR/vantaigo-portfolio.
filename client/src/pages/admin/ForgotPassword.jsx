import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import './Admin.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminAPI.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <img src="/logo.png" alt="Vantaigo" className="login-logo" />
        <h2>Admin Panel</h2>
        <p>Vantaigo Software Solutions</p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <FiCheckCircle style={{ color: '#3FB950', fontSize: '3rem', marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>Email Sent!</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              If an account with that email exists, we've sent a secure password reset link to your inbox.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/admin/login" className="btn btn-outline" style={{display: 'inline-block', padding: '0.8rem 1.5rem'}}>← Return to Login</Link>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{marginTop: '1.5rem', marginBottom: '0.5rem'}}>Reset Password</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Enter your admin email address and we'll send you a recovery link.</p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} id="admin-login-form">
              <div className="form-group">
                <label>Admin Email Address</label>
                <label><FiMail /> Admin Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@vantaigo.com"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/admin/login" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Sign In</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
