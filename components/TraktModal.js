import { useEffect } from 'react';
import TraktStats from './TraktStats';

export default function TraktModal({ isOpen, onClose }) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-background border-2 border-primary rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right z-10 bg-surface hover:bg-primary/20 text-primary border border-primary/30 rounded-lg px-4 py-2 font-mono transition-colors"
          aria-label="Close"
        >
          ✕ ESC
        </button>

        {/* Content */}
        <div className="p-8">
          <TraktStats />
        </div>
      </div>
    </div>
  );
}
