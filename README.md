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

## Installing Node.js

If you don't have Node.js installed, choose one of the following methods:

### Option 1: Official Node.js Installer (Recommended for Beginners)

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Option 2: Using Node Version Manager (Recommended for Developers)

**Windows (nvm-windows):**
1. Download nvm-windows from [github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
2. Run the installer
3. Open a new terminal and install Node.js:
   ```bash
   nvm install lts
   nvm use lts
   ```

**macOS/Linux (nvm):**
1. Install nvm:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```
2. Restart your terminal and install Node.js:
   ```bash
   nvm install --lts
   nvm use --lts
   ```

### Option 3: Package Managers

**macOS (Homebrew):**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install nodejs
```

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

## Development with Claude Code CLI

This template is optimized for use with [Claude Code](https://code.claude.com/), an AI-powered CLI tool that can help you extend and customize the template.

### Getting Started with Claude Code

1. **Install Claude Code**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Authenticate**
   ```bash
   claude auth
   ```
   Follow the prompts to sign in with your Anthropic account.

3. **Initialize your project**
   ```bash
   cd jira-nodejs-starter
   claude
   ```
   Once Claude starts, run:
   ```
   /init
   ```
   This creates a CLAUDE.md file that helps Claude understand your project structure, coding conventions, and guidelines. You can customize this file to provide project-specific context.

4. **Open your project in VS Code**
   ```bash
   code .
   ```

5. **Start Claude Code in VS Code's integrated terminal**
   - Open the integrated terminal in VS Code: `` Ctrl+` `` (backtick) or `View > Terminal`
   - Start Claude Code:
     ```bash
     claude
     ```
   - Claude will initialize and be ready to help with your project

### Using Claude Code in VS Code

**Benefits of using Claude Code in VS Code:**
- Claude can read and edit files directly in your workspace
- Changes appear immediately in your editor
- You can review Claude's changes using VS Code's diff view
- Keep your code and Claude side-by-side

**Recommended VS Code Setup:**
1. **Split terminal and editor**: Use split panes to see code and Claude simultaneously
2. **Source control integration**: Review changes in VS Code's Git panel before committing
3. **Auto-save**: Enable auto-save (`File > Auto Save`) to see Claude's changes immediately

### Using the Terminal with Claude

**Starting a session:**
```bash
# Start in your project directory
cd jira-nodejs-starter
claude

# Or specify a different model if needed
claude --model sonnet
```

**During a session:**
- Type naturally - describe what you want in plain English
- Press `Ctrl+C` to cancel Claude's current operation
- Type `exit` or press `Ctrl+D` to end the session
- Claude maintains context throughout the conversation

**Reviewing changes:**
- Claude will show you what files it modifies
- Use `git diff` to review all changes
- Use VS Code's Source Control panel for a visual diff

### Common Claude Code Tasks

#### Understanding the Codebase
```
"Explain how the Jira authentication works in this template"
"Show me how pagination is handled in the searchIssues function"
"What helper functions are available and what do they do?"
```

#### Adding New Features
```
"Add a function to fetch all comments from an issue"
"Create a new example that exports issue history to JSON"
"Add support for updating issue fields"
```

#### Debugging and Fixes
```
"Why am I getting authentication errors?"
"Fix the rate limiting issues when fetching many issues"
"Add better error handling to the CSV export"
```

#### Code Improvements
```
"Refactor the helpers.js file to use async/await consistently"
"Add JSDoc comments to all exported functions"
"Add input validation to the searchIssues function"
```

### Useful Slash Commands

Claude Code provides built-in slash commands to enhance your workflow:

- **`/init`** - Initialize project with CLAUDE.md guide (helps Claude understand your project)
- **`/help`** - Get help with using Claude Code
- **`/review`** - Request a code review of recent changes
- **`/memory`** - Edit CLAUDE.md memory files to customize project context
- **`/context`** - Visualize current context usage
- **`/cost`** - Show token usage and cost statistics
- **`/export`** - Export the current conversation to a file
- **`/clear`** - Clear conversation history for a fresh start

Type any slash command during a Claude Code session to use it.

### Tips for Using Claude Code

- **Be specific**: Describe what you want to achieve clearly
- **Reference files**: Claude can read and modify multiple files
- **Iterate**: Start with basic functionality and refine
- **Ask questions**: Claude can explain code and suggest improvements
- **Use context**: Claude understands your project structure

### Example Workflow

```bash
# Start Claude Code
claude

# Example session:
You: "I need to add a function that fetches sprint data from Jira"
Claude: [Analyzes codebase and adds the function to helpers.js]

You: "Now create an example script that uses this function"
Claude: [Creates examples/sprint-report.js and updates package.json]

You: "Add error handling and rate limiting"
Claude: [Improves the implementation with robust error handling]
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
