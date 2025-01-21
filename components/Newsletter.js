import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/website/newsletter/subscribe`, { email });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.detail || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="border border-primary-dark p-6 bg-surface">
      <h3 className="text-xl font-bold text-primary mb-4">Subscribe to my newsletter</h3>
      <p className="text-primary-light mb-4">
        Get updates on my latest projects, blog posts, and tech insights.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full bg-background border border-primary-dark p-2 text-primary-light focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-primary-dark text-primary border border-primary-medium hover:bg-primary hover:text-background px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
        {status === 'success' && (
          <p className="text-primary text-sm">Thanks for subscribing!</p>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
};

export default Newsletter;
