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

// Azure App Service / Front Door terminate TLS and forward requests, so trust
// the platform proxy. This makes req.ip and the rate limiter use the real
// client address instead of the proxy's internal IP.
app.set('trust proxy', 1);

// Allow one or more origins (comma separated) so the app works for both the
// Azure Static Web App default domain and any custom domain.
const allowedOrigins = env.clientUrl
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(null, false);
  },
}));
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
