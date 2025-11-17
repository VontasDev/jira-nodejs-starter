/**
 * Helper functions for common Jira data operations
 */

/**
 * Search for issues using JQL (Jira Query Language)
 * Automatically handles pagination to fetch all results
 *
 * @param {Object} jiraClient - Authenticated Jira client
 * @param {string} jql - JQL query string
 * @param {string} fields - Comma-separated list of fields to return (default: all)
 * @param {number} maxResults - Maximum results per page (default: 100)
 * @returns {Promise<Array>} Array of all matching issues
 */
async function searchIssues(jiraClient, jql, fields = '*all', maxResults = 100) {
  try {
    console.log(`Searching issues with JQL: ${jql}`);

    let allIssues = [];
    let startAt = 0;
    let total = 0;

    do {
      const params = new URLSearchParams({
        jql: jql,
        startAt: startAt.toString(),
        maxResults: maxResults.toString(),
        fields: fields,
      });

      const response = await jiraClient.get(`/rest/api/3/search/jql?${params.toString()}`);

      total = response.data.total || 0;
      const issues = response.data.issues || [];
      allIssues = allIssues.concat(issues);
      startAt += maxResults;

      console.log(`Fetched ${allIssues.length}${total > 0 ? ` of ${total}` : ''} issues...`);

      if (issues.length < maxResults) {
        break;
      }
    } while (startAt < total);

    console.log(`\nTotal issues fetched: ${allIssues.length}\n`);
    return allIssues;
  } catch (error) {
    console.error('Error searching issues:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get a single issue by key with all fields
 *
 * @param {Object} jiraClient - Authenticated Jira client
 * @param {string} issueKey - Issue key (e.g., "PROJ-123")
 * @param {string} fields - Comma-separated list of fields (default: all)
 * @returns {Promise<Object>} Issue data
 */
async function getIssue(jiraClient, issueKey, fields = '*all') {
  try {
    const response = await jiraClient.get(`/rest/api/3/issue/${issueKey}`, {
      params: { fields },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching issue ${issueKey}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get issue changelog (history of changes)
 *
 * @param {Object} jiraClient - Authenticated Jira client
 * @param {string} issueKey - Issue key (e.g., "PROJ-123")
 * @returns {Promise<Object>} Changelog data
 */
async function getIssueChangelog(jiraClient, issueKey) {
  try {
    const response = await jiraClient.get(`/rest/api/3/issue/${issueKey}`, {
      params: { expand: 'changelog' },
    });
    return response.data.changelog;
  } catch (error) {
    console.error(`Error fetching changelog for ${issueKey}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * List all custom fields available in Jira
 * Useful for finding field IDs needed for queries
 *
 * @param {Object} jiraClient - Authenticated Jira client
 * @returns {Promise<Array>} Array of custom field definitions
 */
async function listCustomFields(jiraClient) {
  try {
    const response = await jiraClient.get('/rest/api/3/field');
    const customFields = response.data.filter(field => field.custom);
    return customFields;
  } catch (error) {
    console.error('Error fetching custom fields:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get all projects accessible to the user
 *
 * @param {Object} jiraClient - Authenticated Jira client
 * @returns {Promise<Array>} Array of projects
 */
async function listProjects(jiraClient) {
  try {
    const response = await jiraClient.get('/rest/api/3/project');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get all statuses for a project
 *
 * @param {Object} jiraClient - Authenticated Jira client
 * @param {string} projectKey - Project key
 * @returns {Promise<Array>} Array of statuses
 */
async function getProjectStatuses(jiraClient, projectKey) {
  try {
    const response = await jiraClient.get(`/rest/api/3/project/${projectKey}/statuses`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching statuses for ${projectKey}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * Extract specific field values from issues array
 * Useful for data analysis and export
 *
 * @param {Array} issues - Array of issue objects
 * @param {Array} fieldNames - Array of field names to extract
 * @returns {Array} Array of objects with only specified fields
 */
function extractFields(issues, fieldNames) {
  return issues.map(issue => {
    const extracted = {
      key: issue.key,
    };

    fieldNames.forEach(fieldName => {
      // Handle nested field access (e.g., "status.name")
      const value = fieldName.split('.').reduce((obj, key) => obj?.[key], issue.fields);
      extracted[fieldName] = value;
    });

    return extracted;
  });
}

module.exports = {
  searchIssues,
  getIssue,
  getIssueChangelog,
  listCustomFields,
  listProjects,
  getProjectStatuses,
  extractFields,
};
