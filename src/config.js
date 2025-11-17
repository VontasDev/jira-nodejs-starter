require('dotenv').config();

/**
 * Application configuration loaded from environment variables
 */
const config = {
  jira: {
    host: process.env.JIRA_HOST,
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN,
  },
};

/**
 * Validate that all required configuration is present
 * @throws {Error} If required environment variables are missing
 */
function validateConfig() {
  const missing = [];

  if (!config.jira.host) missing.push('JIRA_HOST');
  if (!config.jira.email) missing.push('JIRA_EMAIL');
  if (!config.jira.apiToken) missing.push('JIRA_API_TOKEN');

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please copy .env.example to .env and fill in your Jira credentials.'
    );
  }
}

module.exports = { config, validateConfig };
