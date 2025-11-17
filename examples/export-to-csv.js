/**
 * Example: Export issue data to CSV format for analysis
 */

const { validateConfig, createJiraClient, searchIssues, extractFields } = require('../src');

/**
 * Convert array of objects to CSV string
 */
function convertToCSV(data) {
  if (data.length === 0) return '';

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}

async function main() {
  try {
    validateConfig();
    const jiraClient = createJiraClient();

    // Customize your JQL query
    const jql = 'project = MYPROJECT AND created >= startOfYear() ORDER BY created DESC';

    // Fetch issues with specific fields for better performance
    const fields = 'summary,status,assignee,reporter,created,updated,priority,issuetype';
    const issues = await searchIssues(jiraClient, jql, fields);

    // Extract and flatten the data
    const data = extractFields(issues, [
      'summary',
      'status.name',
      'assignee.displayName',
      'reporter.displayName',
      'created',
      'updated',
      'priority.name',
      'issuetype.name'
    ]);

    // Convert to CSV
    const csv = convertToCSV(data);

    // Output to console (can be redirected to file with: node export-to-csv.js > output.csv)
    console.log(csv);

    // To save to file, uncomment:
    // const fs = require('fs');
    // fs.writeFileSync('jira-export.csv', csv);
    // console.log('Data exported to jira-export.csv');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
