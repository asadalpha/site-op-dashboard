const { query } = require('../config/database');

const getSummary = async () => {
  const result = await query(`SELECT (SELECT COUNT(*) FROM sites) AS "totalSites", (SELECT COUNT(*) FROM sites WHERE status = 'active') AS "activeSites", (SELECT COUNT(*) FROM installations) AS "totalInstallations", (SELECT COUNT(*) FROM installations WHERE status = 'completed') AS "completedInstallations", (SELECT COUNT(*) FROM installations WHERE status = 'in_progress') AS "inProgressInstallations", (SELECT COUNT(*) FROM installations WHERE status = 'failed') AS "failedInstallations"`);
  return Object.fromEntries(Object.entries(result.rows[0]).map(([key, value]) => [key, Number(value)]));
};

module.exports = { getSummary };
