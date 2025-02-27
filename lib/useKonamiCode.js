import { useState, useEffect, useCallback } from 'react';

// Konami code sequence: up, up, down, down, left, right, left, right, b, a
const KONAMI_CODE = [
  'ArrowUp', 
  'ArrowUp', 
  'ArrowDown', 
  'ArrowDown', 
  'ArrowLeft', 
  'ArrowRight', 
  'ArrowLeft', 
  'ArrowRight', 
  'KeyB', 
  'KeyA'
];

export function useKonamiCode() {
  const [konamiDetected, setKonamiDetected] = useState(false);
  const [keys, setKeys] = useState([]);

  const keydownHandler = useCallback((e) => {
    // Get the key from the event
    const key = e.code;
    
    // Update the keys array
    setKeys(prevKeys => {
      const updatedKeys = [...prevKeys, key];
      
      // Only keep the last N keys where N is the length of the Konami code
      if (updatedKeys.length > KONAMI_CODE.length) {
        return updatedKeys.slice(-KONAMI_CODE.length);
      }
      
      return updatedKeys;
    });
  }, []);

  // Check if the Konami code has been entered
  useEffect(() => {
    if (keys.length === KONAMI_CODE.length) {
      const isKonamiCode = keys.every((key, index) => key === KONAMI_CODE[index]);
      
      if (isKonamiCode) {
        setKonamiDetected(true);
        
        // Reset the keys array
        setKeys([]);
        
        // Reset the detection after a short delay
        setTimeout(() => {
          setKonamiDetected(false);
        }, 100);
      }
    }
  }, [keys]);

  // Add and remove the event listener
  useEffect(() => {
    window.addEventListener('keydown', keydownHandler);
    
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [keydownHandler]);

  return konamiDetected;
}
