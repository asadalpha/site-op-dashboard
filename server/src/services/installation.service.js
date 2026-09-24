const repository = require('../repositories/installation.repository');

const notFound = () => Object.assign(new Error('Installation not found'), { statusCode: 404 });
const list = (query) => repository.findAll({ siteId: query.siteId, status: query.status });
const get = async (id) => {
  const item = await repository.findById(id);
  if (!item) throw notFound();
  return item;
};
const create = (data) => repository.create(data);
const update = async (id, data) => {
  const item = await repository.update(id, data);
  if (!item) throw notFound();
  return item;
};
const remove = async (id) => {
  if (!(await repository.remove(id))) throw notFound();
};

module.exports = { list, get, create, update, remove };
