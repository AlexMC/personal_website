import axios from 'axios';

export async function getContributionsData() {
  try {
    const { data } = await axios.get('/api/github/contributions');
    return data;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return {
      contributions: {},
      totalContributions: 0,
    };
  }
}
