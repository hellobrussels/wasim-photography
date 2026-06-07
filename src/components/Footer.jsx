import React from 'react';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <h3>LUMIÈRE<span style={{ color: 'var(--color-accent)' }}>.</span></h3>
                    <p>Capturing moments, crafting stories.</p>
                </div>

                <div className="footer-socials">
                    <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                    <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                    <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
                    <a href="#" aria-label="Email"><Mail size={20} /></a>
                </div>

                <div className="footer-copyright">
                    <p>&copy; {new Date().getFullYear()} Lumière Studio. All rights reserved.</p>
                </div>
            </div>

            <style>{`
        .footer {
          background-color: var(--color-bg-light);
          padding: 4rem 0 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: auto;
        }
        
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2rem;
        }
        
        .footer-brand h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .footer-brand p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        
        .footer-socials {
          display: flex;
          gap: 1.5rem;
        }
        
        .footer-socials a {
          color: var(--color-text-muted);
          transition: var(--transition);
        }
        
        .footer-socials a:hover {
          color: var(--color-accent);
          transform: translateY(-2px);
        }
        
        .footer-copyright {
          border-top: 1px solid rgba(255,255,255,0.05);
          width: 100%;
          padding-top: 2rem;
          margin-top: 2rem;
        }
        
        .footer-copyright p {
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }
      `}</style>
        </footer>
    );
};

export default Footer;
