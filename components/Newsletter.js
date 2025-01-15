import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Replace with your newsletter service endpoint
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <div className="section">
      <div className="container-custom max-w-2xl">
        <div className="p-6 bg-surface rounded-none border border-primary-dark">
          <h2 className="text-2xl font-bold mb-4 text-glow">&gt; subscribe</h2>
          <p className="text-primary-light mb-6">
            Get notified about new blog posts and projects. No spam, unsubscribe at any time.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="terminal-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full"
            >
              {status === 'sending' ? (
                <span className="loading-cursor">Subscribing_</span>
              ) : (
                'Subscribe'
              )}
            </button>

            {status === 'success' && (
              <p className="text-primary text-sm">
                <span className="loading-cursor">Thanks for subscribing_</span>
              </p>
            )}
            {status === 'error' && (
              <p className="text-primary text-sm">
                <span className="loading-cursor">Error: Please try again_</span>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
