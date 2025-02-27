import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocalStorage } from '../lib/useLocalStorage';
import { useKonamiCode } from '../lib/useKonamiCode';

export default function GameBar() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useLocalStorage('gameBarVisible', false);
  const konamiDetected = useKonamiCode();
  const [showEffect, setShowEffect] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/api/website/games`);
        
        if (!response.ok) {
          throw new Error(`Error fetching games: ${response.status}`);
        }
        
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch games:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGames();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchGames, 5 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [API_URL]);

  // Toggle visibility when Konami code is detected
  useEffect(() => {
    if (konamiDetected) {
      // Show the effect
      setShowEffect(true);
      
      // Toggle visibility - force it to be visible
      setIsVisible(true);
      
      // Hide the effect after animation completes
      setTimeout(() => {
        setShowEffect(false);
      }, 1000);
    }
  }, [konamiDetected, setIsVisible]);

  // Add ESC key handler to close the game bar
  useEffect(() => {
    function handleEscapeEvent() {
      console.log('Custom ESC event received in GameBar');
      setIsVisible(false);
    }

    // Listen for the custom escape event
    document.addEventListener('escapeKeyPressed', handleEscapeEvent);
    
    // Clean up
    return () => {
      document.removeEventListener('escapeKeyPressed', handleEscapeEvent);
    };
  }, [setIsVisible]);

  // Calculate session duration in a human-readable format
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (loading || error) {
    return null; // Don't show anything while loading or if there's an error
  }

  return (
    <>
      {showEffect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-ping bg-primary rounded-full h-32 w-32 opacity-75"></div>
        </div>
      )}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-3 text-white z-40 shadow-lg animate-slideUp">
          <div className="flex overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex space-x-6">
              {games.map((game) => (
                <div key={game.id} className="flex-shrink-0 w-48 flex flex-col items-center">
                  <div className="w-32 h-40 relative mb-2">
                    {game.box_art_url ? (
                      <Image 
                        src={game.box_art_url}
                        alt={game.game_name}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="rounded-md"
                        onError={(e) => {
                          // Replace with fallback on error
                          e.target.style.display = 'none';
                          e.target.parentNode.classList.add('bg-gray-800');
                          e.target.parentNode.innerHTML += '<span class="text-xs text-gray-400">Image error</span>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-md">
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-medium truncate max-w-full" title={game.game_name}>
                      {game.game_name.replace(/\([^)]*\)\..*$/, '')}
                    </h3>
                    <p className="text-xs text-gray-400">{game.system}</p>
                    <p className="text-xs text-gray-300">
                      {calculateDuration(game.start_time, game.end_time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end items-center mt-1">
            <button 
              onClick={() => {
                console.log('Close button clicked');
                setIsVisible(false);
              }}
              className="text-xs text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
