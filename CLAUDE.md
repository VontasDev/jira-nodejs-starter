# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js starter template for Jira data extraction and analysis. It provides a clean, modular foundation for querying Jira issues via the REST API v3, with automatic pagination, helper functions, and example scripts.

## Architecture

The codebase follows a three-layer architecture:

1. **Configuration Layer** (`src/config.js`): Environment-based configuration using dotenv. Always call `validateConfig()` before creating a client to ensure JIRA_HOST, JIRA_EMAIL, and JIRA_API_TOKEN are set.

2. **Client Layer** (`src/jira-client.js`): Creates an axios instance with Basic Auth (email:token encoded in base64). All Jira API requests go through this authenticated client.

3. **Helper Layer** (`src/helpers.js`): Reusable functions that handle common Jira operations. All helpers accept `jiraClient` as their first parameter.

The `src/index.js` barrel export makes all functionality available via a single import: `require('./src')`.

## Running Examples

```bash
# List all custom fields (useful for finding field IDs)
npm run list-fields

# Run basic query example
npm run example:basic

# Export data to CSV (outputs to stdout)
npm run example:export > output.csv

# Generate issue analytics
npm run example:analytics
```

## Key Patterns

### Pagination Pattern
The `searchIssues` helper automatically handles pagination using a do-while loop that increments `startAt` until all results are fetched. When adding new search functions, follow this pattern to avoid partial results.

### Field Selection
All query helpers accept a `fields` parameter (defaults to `*all`). Use specific field lists to reduce response size and improve performance: `'summary,status,assignee'` instead of fetching all fields.

### Error Handling
Helpers log error details from `error.response?.data` (Jira API errors) and re-throw. Examples catch errors at the top level and exit with status 1.

### Nested Field Access
The `extractFields` helper uses `split('.').reduce()` to handle nested field access (e.g., `'status.name'` or `'assignee.displayName'`). This pattern allows flexible data extraction without hardcoding field structures.

## Configuration

Environment variables are loaded via dotenv from `.env` file:
- `JIRA_HOST`: Full URL (e.g., https://your-domain.atlassian.net) with no trailing slash
- `JIRA_EMAIL`: Email associated with Jira account
- `JIRA_API_TOKEN`: Generated from Atlassian account settings

## Extending the Template

### Adding New Helper Functions

1. Add the function to `src/helpers.js` following the pattern:
   - Accept `jiraClient` as first parameter
   - Use try-catch with descriptive error logging
   - Add JSDoc comments with parameter types and return values
   - Export at the bottom of the file

2. The function will automatically be available via `require('./src')` due to the spread operator in `src/index.js`

### Adding New Examples

1. Create a new file in `examples/` directory
2. Import functions from `../src`: `const { validateConfig, createJiraClient, ... } = require('../src');`
3. Follow the pattern: validate config → create client → perform operations → handle errors
4. Add a script to `package.json` for easy execution

### Working with Custom Fields

Jira custom fields use IDs like `customfield_10001`. Use `npm run list-fields` to discover available fields and their IDs, then reference them in the `fields` parameter or JQL queries.

## Jira API v3 Endpoints

The template uses Jira REST API v3. Common endpoints already implemented:
- `/rest/api/3/search/jql` - JQL search with pagination
- `/rest/api/3/issue/{issueKey}` - Get single issue
- `/rest/api/3/field` - List all fields
- `/rest/api/3/project` - List projects
- `/rest/api/3/project/{projectKey}/statuses` - Get project statuses

All API calls use the authenticated axios client with proper headers and base URL.
