/**
 * Example: Analyze issue data and generate statistics
 */

const { validateConfig, createJiraClient, searchIssues } = require('../src');

/**
 * Calculate statistics from issues
 */
function analyzeIssues(issues) {
  const stats = {
    total: issues.length,
    byStatus: {},
    byAssignee: {},
    byPriority: {},
    byType: {},
    unassigned: 0,
    avgAge: 0,
  };

  let totalAge = 0;

  issues.forEach(issue => {
    // Count by status
    const status = issue.fields.status?.name || 'Unknown';
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

    // Count by assignee
    const assignee = issue.fields.assignee?.displayName || 'Unassigned';
    if (assignee === 'Unassigned') {
      stats.unassigned++;
    }
    stats.byAssignee[assignee] = (stats.byAssignee[assignee] || 0) + 1;

    // Count by priority
    const priority = issue.fields.priority?.name || 'None';
    stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;

    // Count by type
    const type = issue.fields.issuetype?.name || 'Unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;

    // Calculate age
    const created = new Date(issue.fields.created);
    const age = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24)); // days
    totalAge += age;
  });

  stats.avgAge = issues.length > 0 ? Math.round(totalAge / issues.length) : 0;

  return stats;
}

/**
 * Display statistics in a readable format
 */
function displayStats(stats) {
  console.log('='.repeat(80));
  console.log('ISSUE ANALYTICS');
  console.log('='.repeat(80));

  console.log(`\nTotal Issues: ${stats.total}`);
  console.log(`Average Age: ${stats.avgAge} days`);
  console.log(`Unassigned: ${stats.unassigned}`);

  console.log('\n--- By Status ---');
  Object.entries(stats.byStatus)
    .sort((a, b) => b[1] - a[1])
    .forEach(([status, count]) => {
      const percentage = ((count / stats.total) * 100).toFixed(1);
      console.log(`  ${status}: ${count} (${percentage}%)`);
    });

  console.log('\n--- By Assignee (Top 10) ---');
  Object.entries(stats.byAssignee)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([assignee, count]) => {
      const percentage = ((count / stats.total) * 100).toFixed(1);
      console.log(`  ${assignee}: ${count} (${percentage}%)`);
    });

  console.log('\n--- By Priority ---');
  Object.entries(stats.byPriority)
    .sort((a, b) => b[1] - a[1])
    .forEach(([priority, count]) => {
      const percentage = ((count / stats.total) * 100).toFixed(1);
      console.log(`  ${priority}: ${count} (${percentage}%)`);
    });

  console.log('\n--- By Type ---');
  Object.entries(stats.byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const percentage = ((count / stats.total) * 100).toFixed(1);
      console.log(`  ${type}: ${count} (${percentage}%)`);
    });

  console.log('\n' + '='.repeat(80) + '\n');
}

async function main() {
  try {
    validateConfig();
    const jiraClient = createJiraClient();

    // Customize your JQL query for analysis
    const jql = 'project = MYPROJECT AND created >= -30d ORDER BY created DESC';

    console.log('Fetching issues for analysis...\n');
    const issues = await searchIssues(jiraClient, jql);

    const stats = analyzeIssues(issues);
    displayStats(stats);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
