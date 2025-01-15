import { useState, useEffect } from 'react';
import { getContributionsData } from '../lib/github';

const ContributionsChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ contributions: {}, totalContributions: 0 });

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const contributionsData = await getContributionsData();
        setData(contributionsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contributions:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const getContributionColor = (count) => {
    if (count === 0) return 'bg-primary-dark';
    if (count <= 3) return 'bg-primary-medium opacity-40';
    if (count <= 6) return 'bg-primary-medium opacity-70';
    if (count <= 9) return 'bg-primary-light opacity-80';
    return 'bg-primary';
  };

  const renderContributionGrid = () => {
    const today = new Date();
    const days = [];
    const weeks = [];
    
    // Generate last 365 days
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = data.contributions[dateStr] || 0;
      
      days.push({
        date: dateStr,
        count,
        color: getContributionColor(count)
      });

      if (days.length === 7 || i === 0) {
        weeks.push(days.slice());
        days.length = 0;
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-primary-light">
            {data.totalContributions.toLocaleString()} contributions in the last year
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-primary-light">Less</span>
            <div className="flex space-x-1">
              <div className="w-[10px] h-[10px] bg-primary-dark" />
              <div className="w-[10px] h-[10px] bg-primary-medium opacity-40" />
              <div className="w-[10px] h-[10px] bg-primary-medium opacity-70" />
              <div className="w-[10px] h-[10px] bg-primary-light opacity-80" />
              <div className="w-[10px] h-[10px] bg-primary" />
            </div>
            <span className="text-primary-light">More</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-grid grid-flow-col gap-[3px] min-w-full">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`contribution-cell ${day.color}`}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">&gt; git contributions</h2>
        <div className="overflow-x-auto">
          <div className="inline-grid grid-flow-col gap-[3px] min-w-full">
            {Array(52).fill(0).map((_, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
                {Array(7).fill(0).map((_, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="contribution-cell bg-primary-dark animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">&gt; git contributions</h2>
        <div className="text-primary-light">Failed to load contribution data.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">&gt; git contributions</h2>
      {renderContributionGrid()}
    </div>
  );
};

export default ContributionsChart;
