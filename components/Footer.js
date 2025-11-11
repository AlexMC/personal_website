import { useState, useEffect } from 'react';

export default function Footer() {
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState(null);

  // Trigger game bar when 5 taps detected
  useEffect(() => {
    if (tapCount >= 5) {
      // Dispatch game bar event
      const gameBarEvent = new CustomEvent('gameBarActivated');
      document.dispatchEvent(gameBarEvent);

      // Reset
      setTapCount(0);
      if (tapTimer) clearTimeout(tapTimer);
    }
  }, [tapCount, tapTimer]);

  const handleTap = () => {
    // Clear existing timer
    if (tapTimer) clearTimeout(tapTimer);

    // Increment tap count
    setTapCount(prev => prev + 1);

    // Reset after 1 second of no taps
    const timer = setTimeout(() => {
      setTapCount(0);
    }, 1000);
    setTapTimer(timer);
  };

  return (
    <footer className="py-8 border-t border-primary-dark">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="flex justify-center space-x-8 mb-6">
          <a href="https://github.com/alexmc" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary transition-colors">
            GITHUB
          </a>
          <a href="https://twitter.com/alexmc" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary transition-colors">
            TWITTER
          </a>
          <a href="https://www.linkedin.com/in/alexandremcarvalho/" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:text-primary transition-colors">
            LINKEDIN
          </a>
        </div>
        <p
          className="text-primary-light select-none cursor-default"
          onClick={handleTap}
          onTouchEnd={handleTap}
        >
          &copy; {new Date().getFullYear()} Alexandre Carvalho
        </p>
      </div>
    </footer>
  )
}
