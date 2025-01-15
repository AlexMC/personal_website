import { useState, useEffect } from 'react';
import axios from 'axios';

const ContributionsChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/alexmc/events');
        const pushEvents = response.data
          .filter(event => event.type === 'PushEvent')
          .slice(0, 365); // Full year of contributions

        const contributionData = pushEvents.reduce((acc, event) => {
          const date = new Date(event.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + event.payload.commits.length;
          return acc;
        }, {});

        setContributions(contributionData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contributions:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const renderContributionGrid = () => {
    const today = new Date();
    const days = [];
    const weeks = [];
    
    // Generate last 365 days
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = contributions[dateStr] || 0;
      
      days.push({
        date: dateStr,
        count,
        color: count === 0 
          ? 'bg-primary-dark' 
          : count <= 2 
          ? 'bg-primary-medium' 
          : count <= 4 
          ? 'bg-primary-light' 
          : 'bg-primary'
      });

      if (days.length === 7 || i === 0) {
        weeks.push(days.slice());
        days.length = 0;
      }
    }

    return (
      <div className="inline-grid grid-flow-col gap-[3px]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`w-[10px] h-[10px] ${day.color} transition-all duration-300 hover:scale-110 hover:shadow-glow`}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8 text-glow">&gt; git contributions</h2>
          <div className="p-6 bg-surface rounded-none border border-primary-dark">
            <div className="flex justify-center">
              <div className="inline-grid grid-flow-col gap-[3px]">
                {Array(52).fill(0).map((_, weekIndex) => (
                  <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
                    {Array(7).fill(0).map((_, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="w-[10px] h-[10px] bg-primary-dark animate-pulse"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8 text-glow">&gt; git contributions</h2>
          <div className="p-6 bg-surface rounded-none border border-primary-dark">
            <p className="text-primary-light text-center">
              <span className="loading-cursor">Unable to load contributions_</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-custom">
        <h2 className="text-2xl font-bold mb-8 text-glow">&gt; git contributions</h2>
        <div className="p-6 bg-surface rounded-none border border-primary-dark">
          <div className="flex flex-col items-center space-y-6">
            <div className="overflow-x-auto w-full">
              <div className="flex justify-center min-w-max">
                {renderContributionGrid()}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-primary-light">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-[10px] h-[10px] bg-primary-dark" />
                <div className="w-[10px] h-[10px] bg-primary-medium" />
                <div className="w-[10px] h-[10px] bg-primary-light" />
                <div className="w-[10px] h-[10px] bg-primary" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionsChart;
