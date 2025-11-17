/**
 * Main entry point - exports all modules for easy importing
 */

const { config, validateConfig } = require('./config');
const { createJiraClient } = require('./jira-client');
const helpers = require('./helpers');

module.exports = {
  config,
  validateConfig,
  createJiraClient,
  ...helpers,
};
