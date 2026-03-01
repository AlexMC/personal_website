import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getContributionsData() {
  try {
    const { data } = await axios.get(`${API_URL}/api/github/contributions/alexmc`);
    return data;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return {
      contributions: {},
      totalContributions: 0,
    };
  }
}
