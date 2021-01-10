const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign = require('consign');
const cron = require("node-cron");

module.exports = () => {
  const app = express();

  app.set('port', process.env.PORT || config.get('server.port'));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  consign()
    .then('utils')
    .then('data')
    .then('api/services')
    .then('api/controllers')
    .then('api/routes')
    .then('jobs')
    .into(app);

  cron.schedule("*/20 * * * *", () => new app.jobs.CapturaDeLegendas(app).executa());

  return app;
};