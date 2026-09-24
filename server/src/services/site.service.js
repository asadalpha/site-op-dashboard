const repository = require('../repositories/site.repository');

const notFound = () => Object.assign(new Error('Site not found'), { statusCode: 404 });

const list = (query) => repository.findAll({
  search: query.search?.trim(),
  status: query.status,
  page: Math.max(Number(query.page) || 1, 1),
  limit: Math.min(Math.max(Number(query.limit) || 20, 1), 100),
});

const get = async (id) => {
  const site = await repository.findById(id);
  if (!site) throw notFound();
  return site;
};

const create = (data) => repository.create(data);
const update = async (id, data) => {
  const site = await repository.update(id, data);
  if (!site) throw notFound();
  return site;
};
const remove = async (id) => {
  if (!(await repository.remove(id))) throw notFound();
};

module.exports = { list, get, create, update, remove };
