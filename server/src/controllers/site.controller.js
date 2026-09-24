const service = require('../services/site.service');
const { sendCreated, sendSuccess } = require('../utils/api-response');

const id = (req) => Number(req.params.id);
const list = async (req, res) => sendSuccess(res, await service.list(req.query));
const get = async (req, res) => sendSuccess(res, await service.get(id(req)));
const create = async (req, res) => sendCreated(res, await service.create(req.validatedBody));
const update = async (req, res) => sendSuccess(res, await service.update(id(req), req.validatedBody));
const remove = async (req, res) => { await service.remove(id(req)); res.status(204).send(); };

module.exports = { list, get, create, update, remove };
