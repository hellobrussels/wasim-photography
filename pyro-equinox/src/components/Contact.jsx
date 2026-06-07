import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [feedback, setFeedback] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setFeedback('');

        try {
            const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
            const res = await fetch(`${apiBase}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setFeedback(data.message || 'Message envoyé avec succès !');
                setForm({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
                setFeedback(data.error || 'Une erreur est survenue.');
            }
        } catch {
            setStatus('error');
            setFeedback('Impossible de joindre le serveur. Réessayez plus tard.');
        }
    };

    return (
        <section className="section-padding contact-section">
            <div className="container">
                <h2 className="section-title text-center">Contactez-moi</h2>
                <div className="contact-wrapper">
                    <div className="contact-info">
                        <h3>Parlons de votre projet</h3>
                        <p>N'hésitez pas à me contacter pour discuter de vos idées. Je suis disponible pour des projets photographiques, vidéos et d'écriture.</p>
                        <div className="info-item">
                            <strong>Email:</strong> contact@lumiere.studio
                        </div>
                        <div className="info-item">
                            <strong>Studio:</strong> Paris, France
                        </div>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nom</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Votre nom"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="votre@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                placeholder="Décrivez votre projet..."
                                rows="5"
                                value={form.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Feedback */}
                        {feedback && (
                            <div className={`form-feedback ${status}`}>
                                {status === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                <span>{feedback}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-primary submit-btn"
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? (
                                <>
                                    <Loader size={16} className="spin" />
                                    <span>Envoi en cours…</span>
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    <span>Envoyer</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <style>{`
        .contact-wrapper {
            display: flex;
            gap: 4rem;
            margin-top: 3rem;
            flex-wrap: wrap;
        }
        .contact-info {
            flex: 1;
            min-width: 300px;
        }
        .contact-info h3 { margin-bottom: 1rem; color: var(--color-accent); }
        .contact-info p { margin-bottom: 2rem; color: var(--color-text-muted); }
        .info-item { margin-bottom: 1rem; }
        
        .contact-form {
            flex: 1;
            min-width: 300px;
            background: var(--color-bg-light);
            padding: 2rem;
            border-radius: 4px;
        }
        
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 0.8rem;
            background: #000;
            border: 1px solid #333;
            color: #fff;
            border-radius: 2px;
            font-family: inherit;
            font-size: 0.95rem;
            transition: border-color 0.3s ease;
        }
        .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: var(--color-accent);
            box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.12);
        }

        .form-feedback {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.9rem;
            margin-bottom: 1.25rem;
            animation: fadeIn 0.3s ease;
        }
        .form-feedback.success {
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.25);
            color: #22c55e;
        }
        .form-feedback.error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.25);
            color: #ef4444;
        }

        .submit-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            justify-content: center;
        }
        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </section>
    );
};

export default Contact;
