import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import CRMLayout from './CRMLayout';
import { FiTrendingUp, FiBriefcase, FiCode, FiStar, FiClock, FiCheckCircle } from 'react-icons/fi';

const CRMReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const r = await adminAPI.getCRMReports();
        setData(r.data);
      } catch {
        setError('Failed to load analytical reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <CRMLayout title="Analytics & Reports"><div className="crm-loading">Calculating reports...</div></CRMLayout>;
  if (error) return <CRMLayout title="Analytics & Reports"><div className="crm-alert crm-alert-error">{error}</div></CRMLayout>;
  if (!data) return null;

  return (
    <CRMLayout title="Analytics & Reports">
      {/* Revenue Snapshot */}
      <section className="crm-section">
        <div className="crm-section-header">
          <h3>Financial Overview</h3>
        </div>
        <div className="crm-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          
          <div className="crm-card glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="crm-stat-icon" style={{ background: 'rgba(43,165,165,0.15)', color: '#2BA5A5', fontSize: '1.8rem', width: '60px', height: '60px' }}>
              <FiTrendingUp />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Gross Revenue</p>
              <h2 style={{ margin: '4px 0 0', fontSize: '2rem', fontWeight: 800 }}>₹{data.totalRevenue.toLocaleString()}</h2>
            </div>
          </div>

          <div className="crm-card glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="crm-stat-icon" style={{ background: 'rgba(163,113,247,0.15)', color: '#A371F7', fontSize: '1.8rem', width: '60px', height: '60px' }}>
              <FiBriefcase />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>HR Services Revenue</p>
              <h2 style={{ margin: '4px 0 0', fontSize: '2rem', fontWeight: 800 }}>₹{data.hrRevenue.toLocaleString()}</h2>
            </div>
          </div>

          <div className="crm-card glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="crm-stat-icon" style={{ background: 'rgba(63,185,80,0.15)', color: '#3FB950', fontSize: '1.8rem', width: '60px', height: '60px' }}>
              <FiCode />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Software Solutions Revenue</p>
              <h2 style={{ margin: '4px 0 0', fontSize: '2rem', fontWeight: 800 }}>₹{data.softwareRevenue.toLocaleString()}</h2>
            </div>
          </div>

        </div>
      </section>

      {/* Project Statuses */}
      <section className="crm-section" style={{ marginTop: '2rem' }}>
        <div className="crm-section-header">
          <h3>Delivery Tracking</h3>
        </div>
        <div className="crm-form-grid" style={{ gap: '1.5rem' }}>
          
          {/* HR Delivery */}
          <div className="crm-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <FiBriefcase style={{ color: '#A371F7', fontSize: '1.2rem' }} />
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>HR Positions Tracker</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}><FiCheckCircle style={{color:'#3FB950'}}/> Placed / Finished</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{data.totalHrFinished}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}><FiClock style={{color:'#F5A623'}}/> Pending Hire</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{data.totalHrPending}</div>
              </div>
            </div>
          </div>

          {/* Software Delivery */}
          <div className="crm-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <FiCode style={{ color: '#3FB950', fontSize: '1.2rem' }} />
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Software Projects Tracker</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}><FiCheckCircle style={{color:'#3FB950'}}/> Deployed / Done</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{data.totalSwFinished}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}><FiClock style={{color:'#F5A623'}}/> In Development</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{data.totalSwPending}</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Recent Feedback Feed */}
      <section className="crm-section" style={{ marginTop: '2rem' }}>
        <div className="crm-section-header">
          <h3>Recent Client Feedback</h3>
        </div>
        
        {data.recentFeedback.length === 0 ? (
          <div className="crm-empty glass-card">No feedback recorded yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {data.recentFeedback.map(fb => (
              <div key={fb._id} className="crm-feedback-item glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <Link to={`/crm/${fb.clientId}`} className="crm-link" style={{ fontWeight: 600, fontSize: '0.95rem' }}>{fb.clientName}</Link>
                    {fb.source && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {fb.source}</div>}
                  </div>
                  <div className="crm-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} style={{ color: i < fb.rating ? '#F5A623' : 'rgba(255,255,255,0.15)', fill: i < fb.rating ? '#F5A623' : 'none' }} />
                    ))}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.5', fontStyle: 'italic', color: 'var(--text)' }}>
                  "{fb.text}"
                </p>
                <div style={{ marginTop: '12px', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {new Date(fb.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric'})}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </CRMLayout>
  );
};

export default CRMReports;
