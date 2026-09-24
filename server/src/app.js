const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const errorMiddleware = require('./middleware/error.middleware');
const notFoundMiddleware = require('./middleware/not-found.middleware');
const requestLogger = require('./middleware/request-logger.middleware');
const siteRoutes = require('./routes/site.routes');
const installationRoutes = require('./routes/installation.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use(requestLogger);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'site-operations-api' });
});

app.use('/api/sites', siteRoutes);
app.use('/api/installations', installationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
