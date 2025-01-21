import axios from 'axios';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME;

const githubClient = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${GITHUB_TOKEN}`,
  },
});

export async function getContributionsData() {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    // If we're in a static export, this will be called during build time
    const { data } = await githubClient.post('', {
      query,
      variables: { username: GITHUB_USERNAME },
    });

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    const contributions = {};

    calendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        contributions[day.date] = day.contributionCount;
      });
    });

    return {
      contributions,
      totalContributions: calendar.totalContributions,
    };
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    // Return empty data instead of throwing to handle static export gracefully
    return {
      contributions: {},
      totalContributions: 0,
    };
  }
}
