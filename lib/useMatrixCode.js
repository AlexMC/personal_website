import { useState, useEffect, useCallback } from 'react';

// The Matrix secret phrase: "there is no spoon"
const SECRET_PHRASE = 'thereisnospoon';

export function useMatrixCode() {
  const [matrixDetected, setMatrixDetected] = useState(false);
  const [typedChars, setTypedChars] = useState('');

  const keydownHandler = useCallback((e) => {
    // Only track letter keys and space
    if (e.key.length === 1 && /[a-z ]/i.test(e.key)) {
      const char = e.key.toLowerCase();

      // Ignore spaces for easier typing
      if (char === ' ') return;

      setTypedChars(prev => {
        const updated = (prev + char).slice(-SECRET_PHRASE.length);

        // Check if the secret phrase has been typed
        if (updated === SECRET_PHRASE) {
          setMatrixDetected(true);

          // Reset after detection
          setTimeout(() => {
            setMatrixDetected(false);
          }, 100);

          return '';
        }

        return updated;
      });
    }
  }, []);

  // Add and remove the event listener
  useEffect(() => {
    window.addEventListener('keydown', keydownHandler);

    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [keydownHandler]);

  return matrixDetected;
}
