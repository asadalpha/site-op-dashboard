const pinoHttp = require('pino-http');

module.exports = pinoHttp({
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
});
