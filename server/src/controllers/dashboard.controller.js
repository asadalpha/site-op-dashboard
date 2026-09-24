const service = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/api-response');

const summary = async (_req, res) => sendSuccess(res, await service.getSummary());

module.exports = { summary };
