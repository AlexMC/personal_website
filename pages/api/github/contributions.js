import axios from 'axios';

const CONTRIB_TOKEN = process.env.CONTRIB_TOKEN;
const CONTRIB_USERNAME = process.env.CONTRIB_USERNAME;

const githubClient = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${CONTRIB_TOKEN}`,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    const { data } = await githubClient.post('', {
      query,
      variables: { username: CONTRIB_USERNAME },
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

    res.status(200).json({
      contributions,
      totalContributions: calendar.totalContributions,
    });
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
}
