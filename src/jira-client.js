const axios = require('axios');
const { config } = require('./config');

/**
 * Create an authenticated Jira API client using Basic Auth
 * @returns {Object} Axios instance configured for Jira API
 */
function createJiraClient() {
  const auth = Buffer.from(
    `${config.jira.email}:${config.jira.apiToken}`
  ).toString('base64');

  return axios.create({
    baseURL: config.jira.host,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  });
}

module.exports = { createJiraClient };
