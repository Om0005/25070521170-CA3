import { useEffect } from 'react';
import { IconClose } from './icons';

export default function Modal({ title, subtitle, onClose, children, footer, size = 'md' }) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`modal${size === 'sm' ? ' modal--sm' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal__head">
          <div>
            <h2 className="modal__title">{title}</h2>
            {subtitle ? <p className="modal__subtitle">{subtitle}</p> : null}
          </div>
          <button type="button" className="icon-btn modal__close" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </div>

        <div className="modal__body">{children}</div>

        {footer ? <div className="modal__foot">{footer}</div> : null}
      </div>
    </div>
  );
}
