/**
 * Utility: List all custom fields in your Jira instance
 * Useful for finding field IDs to use in queries
 */

const { validateConfig, createJiraClient, listCustomFields } = require('../src');

async function main() {
  try {
    validateConfig();
    const jiraClient = createJiraClient();

    console.log('Fetching custom fields...\n');
    const fields = await listCustomFields(jiraClient);

    console.log('='.repeat(80));
    console.log('CUSTOM FIELDS');
    console.log('='.repeat(80));

    fields.forEach((field, index) => {
      console.log(`\n${index + 1}. ${field.name}`);
      console.log(`   ID: ${field.id}`);
      console.log(`   Type: ${field.schema?.type || 'N/A'}`);
      if (field.schema?.custom) {
        console.log(`   Custom Type: ${field.schema.custom}`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log(`Total custom fields: ${fields.length}`);
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
