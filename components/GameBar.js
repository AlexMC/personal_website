import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLocalStorage } from '../lib/useLocalStorage';
import { useKonamiCode } from '../lib/useKonamiCode';

export default function GameBar() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useLocalStorage('gameBarVisible', false);
  const [cachedGames, setCachedGames] = useLocalStorage('cachedGames', { data: [], timestamp: 0 });
  const konamiDetected = useKonamiCode();
  const [showEffect, setShowEffect] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const gamesContainerRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  // Cache expiration time in milliseconds (30 minutes)
  const CACHE_EXPIRATION = 30 * 60 * 1000;

  const fetchGames = useCallback(async (forceRefresh = false) => {
    try {
      // Check if we have cached data and it's not expired
      const now = Date.now();
      if (!forceRefresh && 
          cachedGames.data.length > 0 && 
          now - cachedGames.timestamp < CACHE_EXPIRATION) {
        console.log('Using cached game data');
        setGames(cachedGames.data);
        setLoading(false);
        return;
      }
      
      console.log('Fetching fresh game data');
      const response = await fetch(`${API_URL}/api/website/games`);
      
      if (!response.ok) {
        throw new Error(`Error fetching games: ${response.status}`);
      }
      
      const data = await response.json();
      setGames(data);
      
      // Update the cache with new data and timestamp
      setCachedGames({
        data,
        timestamp: now
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch games:', err);
      setError(err.message);
      setLoading(false);
      
      // If fetch fails, use cached data if available (even if expired)
      if (cachedGames.data.length > 0) {
        console.log('Fetch failed, using cached data as fallback');
        setGames(cachedGames.data);
      }
    }
  }, [API_URL, cachedGames, setCachedGames]);

  useEffect(() => {
    fetchGames();

    // Refresh data periodically (every 30 minutes)
    const intervalId = setInterval(() => {
      fetchGames(true); // Force refresh on interval
    }, CACHE_EXPIRATION);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Listen for custom game bar event (mobile tap trigger)
  useEffect(() => {
    const handleGameBarActivated = () => {
      setShowEffect(true);
      setIsVisible(true);
      setTimeout(() => {
        setShowEffect(false);
      }, 1000);
    };

    document.addEventListener('gameBarActivated', handleGameBarActivated);

    return () => {
      document.removeEventListener('gameBarActivated', handleGameBarActivated);
    };
  }, [setIsVisible]);

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

  // Navigation functions
  const navigateLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const navigateRight = () => {
    if (currentIndex < games.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading || error) {
    return null; // Don't show anything while loading or if there's an error
  }

  // Number of games to show at once (adjust based on screen size)
  const gamesPerView = 3;
  const canNavigateLeft = currentIndex > 0;
  const canNavigateRight = currentIndex + gamesPerView < games.length;
  
  // Create an array to render the correct number of game slots
  const gamesToRender = games.slice(currentIndex, currentIndex + gamesPerView);
  // If we have fewer games than slots, add empty slots
  while (gamesToRender.length < gamesPerView) {
    gamesToRender.push(null);
  }

  return (
    <>
      {showEffect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-ping bg-primary rounded-full h-32 w-32 opacity-75"></div>
        </div>
      )}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary-dark p-4 text-primary z-40 shadow-lg animate-slideUp">
          <div className="max-w-3xl mx-auto flex items-center">
            <button 
              onClick={navigateLeft}
              disabled={!canNavigateLeft}
              className={`mr-4 p-2 ${canNavigateLeft ? 'text-primary hover:text-white' : 'text-primary-dark cursor-not-allowed'}`}
              aria-label="Previous games"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex-1 overflow-hidden" ref={gamesContainerRef}>
              <div className="flex justify-between gap-2">
                {gamesToRender.map((game, index) => (
                  <div key={index} className="w-1/3 flex flex-col items-center min-w-0">
                    {game ? (
                      <div className="w-full aspect-[2/3] relative mb-2 max-w-[128px]">
                        {game.box_art_url ? (
                          <Image
                            src={game.box_art_url}
                            alt={game.game_name}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="rounded-md"
                            priority={index === 0} // Prioritize loading the first visible image
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
                    ) : (
                      <div className="w-full aspect-[2/3] bg-gray-800 rounded-md max-w-[128px]"></div>
                    )}
                    {game ? (
                      <div className="text-center w-full">
                        <h3 className="text-sm font-medium truncate w-full" title={game.game_name}>
                          {game.game_name.replace(/\([^)]*\)\..*$/, '')}
                        </h3>
                        <p className="text-xs text-primary-light truncate w-full">{game.system}</p>
                        <p className="text-xs text-primary-light">
                          {calculateDuration(game.start_time, game.end_time)}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center w-full">
                        <h3 className="text-sm font-medium truncate w-full"></h3>
                        <p className="text-xs text-primary-light truncate w-full"></p>
                        <p className="text-xs text-primary-light"></p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={navigateRight}
              disabled={!canNavigateRight}
              className={`ml-4 p-2 ${canNavigateRight ? 'text-primary hover:text-white' : 'text-primary-dark cursor-not-allowed'}`}
              aria-label="Next games"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="max-w-3xl mx-auto flex justify-end mt-2">
            <button 
              onClick={() => {
                console.log('Close button clicked');
                setIsVisible(false);
              }}
              className="text-xs text-primary-light hover:text-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
