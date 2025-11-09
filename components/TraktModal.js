import { useEffect, useState } from 'react';
import TraktStats from './TraktStats';
import { getTraktData } from '../lib/trakt';

export default function TraktModal({ isOpen, onClose }) {
  const [traktData, setTraktData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Trakt data from the external backend API
  useEffect(() => {
    if (isOpen && !traktData) {
      setLoading(true);
      getTraktData('alexmc')
        .then(data => {
          setTraktData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load Trakt data:', err);
          setTraktData({ error: 'Failed to load Trakt data' });
          setLoading(false);
        });
    }
  }, [isOpen, traktData]);

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
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-primary-light">Loading your Trakt data...</p>
            </div>
          ) : (
            <TraktStats traktData={traktData} />
          )}
        </div>
      </div>
    </div>
  );
}
