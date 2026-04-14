import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHRMSAuth } from '../../context/HRMSAuthContext';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import './HRMS.css';

import { publicAPI } from '../../api';

const HRMSLogin = () => {
  const { login } = useHRMSAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ employeeId: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.employeeId, form.password);
      navigate('/hrms/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.employeeId) {
      setError('Please enter your Employee ID first to request a password reset.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await publicAPI.requestEmployeePasswordReset({ employeeId: form.employeeId });
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hrms-login-page">
      <div className="hrms-login-bg" />
      <div className="hrms-login-card">
        <div className="hrms-login-logo">
          <img src="/logo.png" alt="Vantaigo" />
          <div>
            <h1>HRMS Portal</h1>
            <p>Vantaigo Software Solutions</p>
          </div>
        </div>

        <h2 className="hrms-login-title">Employee Sign In</h2>
        <p className="hrms-login-sub">Enter your Employee ID and password to access your dashboard</p>

        {error && <div className="hrms-alert hrms-alert-error">{error}</div>}
        {success && <div className="hrms-alert hrms-alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="hrms-login-form">
          <div className="hrms-form-group">
            <label>Employee ID</label>
            <div className="hrms-input-wrap">
              <FiUser className="hrms-input-icon" />
              <input
                className="hrms-input"
                type="text"
                value={form.employeeId}
                onChange={e => setForm({ ...form, employeeId: e.target.value.toUpperCase() })}
                placeholder="e.g. EMP001"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="hrms-form-group">
            <label>Password</label>
            <div className="hrms-input-wrap">
              <FiLock className="hrms-input-icon" />
              <input
                className="hrms-input"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="hrms-link-btn" 
                style={{ fontSize: '0.8rem' }}
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
          </div>
          <button type="submit" className="hrms-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : <><FiLogIn /> Sign In</>}
          </button>
        </form>

        <div className="hrms-login-footer">
          <a href="/admin/login">Admin Login →</a>
        </div>
      </div>
    </div>
  );
};

export default HRMSLogin;
