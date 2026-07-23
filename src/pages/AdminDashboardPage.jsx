import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users'

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Analytics
      const resAnalytics = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const dataAnalytics = await resAnalytics.json();

      if (dataAnalytics.success) {
        setAnalytics(dataAnalytics.data);
      } else {
        setError(dataAnalytics.message || 'Gagal memuat data analitik');
      }

      // 2. Fetch Users List
      const resUsers = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const dataUsers = await resUsers.json();
      if (dataUsers.success) {
        setUsersList(dataUsers.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Koneksi server bermasalah');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin' && token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  if (authLoading || (loading && !analytics)) {
    return (
      <div className="admin-dashboard-container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: '600' }}>
          ⏳ Memuat Admin Analytics Dashboard...
        </div>
      </div>
    );
  }

  // Access Control check
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard-container">
        <div className="unauthorized-card">
          <h2>🔒 Akses Terbatas (Admin Only)</h2>
          <p>
            Halaman ini khusus untuk administrator website. Silakan login menggunakan akun Admin.
          </p>
          <Link to="/login" className="btn-primary-link">
            Ke Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  // Compute max views for chart scaling
  const maxViews = analytics?.dailyTrend?.length
    ? Math.max(...analytics.dailyTrend.map(d => d.views), 1)
    : 1;

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>⚡ Admin Analytics Dashboard</h1>
          <p>Pantau jumlah pengunjung harian, trafik halaman, dan statistik website secara real-time.</p>
        </div>
        <div className="admin-header-actions">
          <div className="admin-badge">
            <span className="admin-badge-dot"></span>
            Admin: {user.name} ({user.email})
          </div>
          <button className="btn-refresh" onClick={fetchData}>
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Navigation Banner */}
      <div className="admin-credentials-banner">
        <div className="admin-credentials-info">
          <h4>📊 Panel Kontrol Admin Analytics</h4>
          <p>
            Kelola statistik pengunjung dan data pengguna platform.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`btn-refresh`} 
            style={{ background: activeTab === 'overview' ? '#38bdf8' : 'rgba(255,255,255,0.1)', color: activeTab === 'overview' ? '#0f172a' : '#fff' }}
          >
            📊 Ikhtisar Analytics
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`btn-refresh`} 
            style={{ background: activeTab === 'users' ? '#38bdf8' : 'rgba(255,255,255,0.1)', color: activeTab === 'users' ? '#0f172a' : '#fff' }}
          >
            👥 Data Pengguna ({usersList.length})
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {activeTab === 'overview' ? (
        <>
          {/* KPI Cards Grid */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Pengunjung Hari Ini</span>
                <div className="kpi-icon primary">👁️</div>
              </div>
              <div className="kpi-value">{analytics?.todayVisits || 0}</div>
              <div className="kpi-subtitle">Total tayangan halaman hari ini</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Pengunjung Unik Hari Ini</span>
                <div className="kpi-icon purple">👤</div>
              </div>
              <div className="kpi-value">{analytics?.todayUnique || 0}</div>
              <div className="kpi-subtitle">Perangkat/User unik hari ini</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Total Pengunjung</span>
                <div className="kpi-icon success">📈</div>
              </div>
              <div className="kpi-value">{analytics?.totalVisits || 0}</div>
              <div className="kpi-subtitle">Semua tayangan halaman terakumulasi</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Total Undangan</span>
                <div className="kpi-icon warning">💌</div>
              </div>
              <div className="kpi-value">{analytics?.totalInvitations || 0}</div>
              <div className="kpi-subtitle">Undangan digital yang dibuat</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Total Pengguna</span>
                <div className="kpi-icon pink">👥</div>
              </div>
              <div className="kpi-value">{analytics?.totalUsers || 0}</div>
              <div className="kpi-subtitle">User terdaftar di platform</div>
            </div>
          </div>

          {/* Charts & Analytics Sections */}
          <div className="dashboard-grid">
            {/* Left: 7-Day Visitor Trend Chart */}
            <div className="card-panel">
              <div className="card-panel-header">
                <div className="card-panel-title">
                  📊 Tren Trafik Pengunjung (7 Hari Terakhir)
                </div>
              </div>

              {analytics?.dailyTrend?.length > 0 ? (
                <div className="chart-container">
                  {analytics.dailyTrend.map((item, index) => {
                    const heightPercent = Math.max((item.views / maxViews) * 100, 8);
                    return (
                      <div key={index} className="chart-bar-group">
                        <div className="chart-bar-wrapper">
                          <div 
                            className="chart-bar-fill" 
                            style={{ height: `${heightPercent}%` }}
                          >
                            <div className="chart-bar-tooltip">
                              {item.views} views ({item.unique_visitors} unik)
                            </div>
                          </div>
                        </div>
                        <span className="chart-label">
                          {item.date ? item.date.substring(5) : `Hari ${index + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  Belum ada grafik statistik kunjungan untuk 7 hari terakhir.
                </div>
              )}
            </div>

            {/* Right: Popular Pages */}
            <div className="card-panel">
              <div className="card-panel-header">
                <div className="card-panel-title">
                  🔥 Halaman Terpopuler
                </div>
              </div>

              {analytics?.popularPages?.length > 0 ? (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Path Halaman</th>
                        <th style={{ textAlign: 'right' }}>Kunjungan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.popularPages.map((page, idx) => (
                        <tr key={idx}>
                          <td>
                            <span className="path-badge">{page.page_path}</span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#38bdf8' }}>
                            {page.visit_count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  Belum ada data halaman terpopuler.
                </div>
              )}
            </div>
          </div>

          {/* Recent Visitor Logs */}
          <div className="card-panel">
            <div className="card-panel-header">
              <div className="card-panel-title">
                🕒 Log Kunjungan Terakhir
              </div>
            </div>

            {analytics?.recentActivity?.length > 0 ? (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID Log</th>
                      <th>Path Halaman</th>
                      <th>Visitor ID</th>
                      <th>Waktu Kunjungan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentActivity.map((log) => (
                      <tr key={log.id}>
                        <td style={{ color: '#64748b' }}>#{log.id}</td>
                        <td>
                          <span className="path-badge">{log.page_path}</span>
                        </td>
                        <td style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>
                          {log.visitor_id ? log.visitor_id.substring(0, 16) + '...' : 'anonymous'}
                        </td>
                        <td style={{ color: '#94a3b8' }}>
                          {new Date(log.created_at).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                Belum ada aktivitas kunjungan terbaru.
              </div>
            )}
          </div>
        </>
      ) : (
        /* Users Tab */
        <div className="card-panel">
          <div className="card-panel-header">
            <div className="card-panel-title">
              👥 Daftar Pengguna Terdaftar ({usersList.length})
            </div>
          </div>

          {usersList.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>No. Telepon</th>
                    <th>Role</th>
                    <th>Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td style={{ fontWeight: '600' }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '-'}</td>
                      <td>
                        <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td style={{ color: '#94a3b8' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              Belum ada pengguna terdaftar.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
