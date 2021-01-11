module.exports = app => {
  const controller = app.api.controllers.LegendaController;

  app.route('/api/legendas')
    .get(controller.consultaLegendas);

  app.route('/api/legendaPorNome')
    .get(controller.consultaLegendaPorNome);
}