/**
 * Basic example: Query issues and display key information
 */

const { validateConfig, createJiraClient, searchIssues } = require('../src');

async function main() {
  try {
    // Validate configuration
    validateConfig();

    // Create Jira client
    const jiraClient = createJiraClient();

    // Define your JQL query
    // Modify this to match your needs
    const jql = 'project = MYPROJECT AND status = "In Progress" ORDER BY created DESC';

    // Search for issues
    // You can specify specific fields to reduce data size:
    // const fields = 'summary,status,assignee,created';
    const issues = await searchIssues(jiraClient, jql);

    // Display results
    console.log('='.repeat(80));
    console.log('QUERY RESULTS:');
    console.log('='.repeat(80));

    issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.key}`);
      console.log(`   Summary: ${issue.fields.summary}`);
      console.log(`   Status: ${issue.fields.status?.name || 'N/A'}`);
      console.log(`   Assignee: ${issue.fields.assignee?.displayName || 'Unassigned'}`);
      console.log(`   Created: ${new Date(issue.fields.created).toLocaleDateString()}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`Total: ${issues.length} issues`);
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
