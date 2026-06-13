import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingAction(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Espace Administration</h1>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label><Mail size={16} /> Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lumiere.studio"
              required 
            />
          </div>
          <div className="form-group">
            <label><Lock size={16} /> Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn-primary login-btn" disabled={loadingAction}>
            {loadingAction ? 'Connexion...' : <><LogIn size={18} /> Se connecter</>}
          </button>
        </form>
      </div>

      <style>{`
        .admin-loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: var(--color-accent);
          background-color: var(--color-bg);
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-bg);
          background-image: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
        }

        .login-card {
          background: rgba(18, 18, 18, 0.8);
          backdrop-filter: blur(10px);
          padding: 3rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .login-title {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          color: var(--color-accent);
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-error {
          background: rgba(255, 77, 77, 0.1);
          color: #ff4d4d;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 77, 77, 0.2);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: var(--color-text);
          font-family: var(--font-main);
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-accent);
          background: rgba(0, 0, 0, 0.8);
        }

        .login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          width: 100%;
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
