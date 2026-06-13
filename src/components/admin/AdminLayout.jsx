import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, LogOut, Camera, FileText as FileTextIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Camera size={24} color="var(--color-accent)" />
          <span>Wasîm Photo & Video Admin</span>
        </div>
        <nav className="admin-nav">
          <Link 
            to="/admin" 
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link 
            to="/admin/media" 
            className={`nav-link ${location.pathname.startsWith('/admin/media') ? 'active' : ''}`}
          >
            <ImageIcon size={20} />
            Médias
          </Link>
          <Link 
            to="/admin/posts" 
            className={`nav-link ${location.pathname.startsWith('/admin/posts') ? 'active' : ''}`}
          >
            <FileTextIcon size={20} />
            Posts
          </Link>
        </nav>
        <div className="admin-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>

      <style>{`
        .admin-loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: var(--color-accent);
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--color-bg);
        }

        .admin-sidebar {
          width: 250px;
          background-color: var(--color-bg-light);
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 100;
        }

        .admin-brand {
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .admin-nav {
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-grow: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          color: var(--color-text-muted);
          transition: all 0.3s ease;
        }

        .nav-link:hover, .nav-link.active {
          background-color: rgba(212, 175, 55, 0.1);
          color: var(--color-accent);
        }

        .admin-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          color: var(--color-text-muted);
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .logout-btn:hover {
          background: rgba(255,0,0,0.1);
          color: #ff4d4d;
        }

        .admin-content {
          flex-grow: 1;
          margin-left: 250px;
          padding: 2rem;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            width: 100%;
            height: auto;
            position: relative;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            border-right: none;
          }
          .admin-brand {
            padding: 1rem;
            border-bottom: none;
          }
          .admin-nav {
            flex-direction: row;
            padding: 1rem;
          }
          .admin-footer {
            padding: 1rem;
            border-top: none;
          }
          .admin-content {
            margin-left: 0;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
