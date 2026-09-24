module.exports = (error, req, res, _next) => {
  req.log?.error(error);

  if (error.code === '28P01') {
    return res.status(503).json({ error: 'Database authentication failed. Check the PostgreSQL credentials in server/.env.' });
  }

  if (error.code === '3D000') {
    return res.status(503).json({ error: 'Database does not exist. Create site_operations or check DATABASE_URL.' });
  }

  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return res.status(503).json({ error: 'Database is unavailable. Check that PostgreSQL is running and DATABASE_URL is correct.' });
  }

  if (error.code === '23505') {
    return res.status(409).json({ error: 'A record with that value already exists' });
  }

  if (error.code === '23503') {
    return res.status(400).json({ error: 'A related record does not exist' });
  }

  return res.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : 'Internal server error',
  });
};
