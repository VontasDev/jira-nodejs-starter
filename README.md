# Jira Node.js Starter Template

A starter template for building Jira data extraction and analysis tools with Node.js. This template provides a solid foundation for querying Jira issues, extracting data, and performing analysis.

## Features

- Simple Jira API authentication setup
- Helper functions for common operations
- Automatic pagination handling
- Example scripts for:
  - Basic issue queries
  - CSV export for spreadsheet analysis
  - Statistical analysis
  - Custom field discovery
- Clean, modular code structure
- Environment-based configuration

## Prerequisites

- Node.js (v14 or higher)
- A Jira account with API access
- Jira API token ([create one here](https://id.atlassian.com/manage-profile/security/api-tokens))

## Quick Start

### 1. Installation

```bash
# Clone this repository (or use as template)
git clone <repository-url>
cd jira-nodejs-starter

# Install dependencies
npm install
```

### 2. Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Jira credentials
# JIRA_HOST=https://your-domain.atlassian.net
# JIRA_EMAIL=your-email@example.com
# JIRA_API_TOKEN=your-api-token-here
```

### 3. Run Examples

```bash
# List all custom fields in your Jira instance
npm run list-fields

# Run a basic query
npm run example:basic

# Export data to CSV
npm run example:export > output.csv

# Generate issue analytics
npm run example:analytics
```

## Project Structure

```
jira-nodejs-starter/
├── src/
│   ├── config.js          # Configuration management
│   ├── jira-client.js     # Jira API client setup
│   ├── helpers.js         # Common helper functions
│   └── index.js           # Main exports
├── examples/
│   ├── basic-query.js           # Simple query example
│   ├── export-to-csv.js         # CSV export example
│   ├── issue-analytics.js       # Analytics example
│   └── list-custom-fields.js    # Field discovery utility
├── .env.example           # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Available Helper Functions

### `searchIssues(jiraClient, jql, fields, maxResults)`
Search for issues using JQL with automatic pagination.

```javascript
const issues = await searchIssues(
  jiraClient,
  'project = MYPROJECT AND status = "In Progress"',
  'summary,status,assignee',
  100
);
```

### `getIssue(jiraClient, issueKey, fields)`
Get a single issue by key.

```javascript
const issue = await getIssue(jiraClient, 'PROJ-123');
```

### `getIssueChangelog(jiraClient, issueKey)`
Get the complete history of changes for an issue.

```javascript
const changelog = await getIssueChangelog(jiraClient, 'PROJ-123');
```

### `listCustomFields(jiraClient)`
List all custom fields available in your Jira instance.

```javascript
const fields = await listCustomFields(jiraClient);
```

### `listProjects(jiraClient)`
Get all projects accessible to the authenticated user.

```javascript
const projects = await listProjects(jiraClient);
```

### `extractFields(issues, fieldNames)`
Extract specific fields from an array of issues for analysis.

```javascript
const data = extractFields(issues, ['summary', 'status.name', 'assignee.displayName']);
```

## Usage Examples

### Basic Query

```javascript
const { validateConfig, createJiraClient, searchIssues } = require('./src');

async function main() {
  validateConfig();
  const jiraClient = createJiraClient();

  const jql = 'project = MYPROJECT AND created >= -7d';
  const issues = await searchIssues(jiraClient, jql);

  console.log(`Found ${issues.length} issues`);
}

main();
```

### Export to CSV

```javascript
const { validateConfig, createJiraClient, searchIssues, extractFields } = require('./src');

async function exportData() {
  validateConfig();
  const jiraClient = createJiraClient();

  const issues = await searchIssues(jiraClient, 'project = MYPROJECT');
  const data = extractFields(issues, [
    'summary',
    'status.name',
    'assignee.displayName',
    'created'
  ]);

  // Convert to CSV and save/output
  // (see examples/export-to-csv.js for full implementation)
}

exportData();
```

### Custom Analysis

```javascript
const { validateConfig, createJiraClient, searchIssues } = require('./src');

async function analyzeIssues() {
  validateConfig();
  const jiraClient = createJiraClient();

  const issues = await searchIssues(jiraClient, 'project = MYPROJECT');

  // Perform your custom analysis
  const byStatus = {};
  issues.forEach(issue => {
    const status = issue.fields.status.name;
    byStatus[status] = (byStatus[status] || 0) + 1;
  });

  console.log('Issues by status:', byStatus);
}

analyzeIssues();
```

## JQL Query Examples

```javascript
// Issues created in the last 30 days
'created >= -30d'

// Open issues assigned to you
'assignee = currentUser() AND status != Done'

// High priority bugs
'issuetype = Bug AND priority = High'

// Issues updated this week
'updated >= startOfWeek()'

// Complex query with multiple conditions
'project = MYPROJECT AND status IN ("In Progress", "Review") AND created >= startOfYear() ORDER BY created DESC'
```

## Finding Custom Field IDs

Run the field discovery utility to find custom field IDs:

```bash
npm run list-fields
```

This will display all custom fields with their IDs, which you can use in your queries:

```javascript
const fields = 'summary,status,customfield_10001,customfield_10002';
const issues = await searchIssues(jiraClient, jql, fields);
```

## Common Use Cases

### 1. Generate Reports
Extract issue data and analyze trends, team performance, or project status.

### 2. Data Export
Export Jira data to CSV/Excel for further analysis in spreadsheet tools.

### 3. Dashboard Data
Fetch data to power custom dashboards or visualizations.

### 4. Automation
Build automated workflows based on issue states and changes.

### 5. Integration
Extract data for integration with other tools and systems.

## API Rate Limits

Be mindful of Jira's API rate limits:
- Cloud: ~100 requests per minute per user
- Add delays between requests if processing many issues
- Use specific field selection to reduce response size

## Troubleshooting

### Authentication Errors
- Verify your API token is correct
- Ensure your email matches your Jira account
- Check that your Jira host URL is correct (no trailing slash)

### Permission Errors
- Verify you have access to the project/issues
- Check your Jira user permissions

### Rate Limiting
- Add delays between requests: `await new Promise(r => setTimeout(r, 100))`
- Reduce batch sizes
- Use specific field selection

## Contributing

This is a starter template - feel free to customize it for your specific needs!

## License

MIT

## Resources

- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [JQL (Jira Query Language) Guide](https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/)
- [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
