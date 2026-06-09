import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const ModalWrapper = ({ title, subtitle, onClose, children, size = 'md' }) => {
  const maxWidth = size === 'lg' ? '1100px' : size === 'sm' ? '520px' : '720px';
  const ref = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const node = ref.current;
    const focusable = node.querySelectorAll('a[href],button,textarea,input,select,[tabindex]:not([tabindex="-1"])');
    if (focusable && focusable.length) focusable[0].focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
      if (e.key === 'Tab') {
        // simple focus trap
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      if (previouslyFocused.current && previouslyFocused.current.focus) previouslyFocused.current.focus();
    };
  }, [onClose]);

  return (
    <div className="mw-overlay" aria-hidden={false}>
      <div ref={ref} className="mw-content" style={{ maxWidth }} role="dialog" aria-modal="true" aria-labelledby="mw-title" aria-describedby={subtitle ? 'mw-sub' : undefined}>
        <div className="mw-header">
          <div>
            {title && <h2 id="mw-title" className="mw-title">{title}</h2>}
            {subtitle && <div id="mw-sub" className="mw-sub">{subtitle}</div>}
          </div>
          <button className="mw-close" onClick={onClose} aria-label="Fermer"><X size={18} /></button>
        </div>

        <div className="mw-body">{children}</div>
      </div>

      <style>{`
        .mw-overlay{position:fixed;inset:0;background:linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.55));backdrop-filter: blur(6px);display:flex;align-items:center;justify-content:center;z-index:1500}
        .mw-content{background:var(--color-bg-light);padding:1.25rem;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,0.65);width:100%;max-height:92vh;overflow:auto;position:relative;transform-origin:center center;animation:mw-open 260ms cubic-bezier(.2,.9,.3,1);border:1px solid rgba(255,255,255,0.03)}
        .mw-header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:0.75rem}
        .mw-close{background:rgba(255,255,255,0.02);border:none;color:var(--color-text);cursor:pointer;padding:8px;border-radius:10px;transition:all 160ms ease}
        .mw-close:hover{background:var(--color-accent);color:#000;transform:scale(1.03)}
        .mw-close:focus{outline:2px solid rgba(212,175,55,0.18);outline-offset:2px}
        .mw-title{margin:0;color:var(--color-accent);font-family:var(--font-heading);font-size:1.15rem}
        .mw-sub{color:var(--color-text-muted);font-size:0.95rem;margin-top:4px}
        .mw-body{color:var(--color-text);padding-top:0.5rem}
        @keyframes mw-open{0%{opacity:0;transform:translateY(10px) scale(0.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @media (max-width:768px){.mw-content{padding:1rem;border-radius:10px}}
      `}</style>
    </div>
  );
};

export default ModalWrapper;
