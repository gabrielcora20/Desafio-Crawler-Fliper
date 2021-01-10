module.exports = (app) => {
  const LegendaController = {};

  const legendaService = new app.api.services.LegendaService(app);

  LegendaController.consultaLegendas = (req, res) => {
    legendaService.obtemLegendas((erro, result) => {
      if (erro)
        res.status(500).json(erro);
      else
        res.status(200).json(result);
    });
  }

  LegendaController.consultaLegenda = (req, res) => {
    legendaService.obtemLegenda(req.body, (result, erro) => {
      if (erro)
        res.status(500).json(erro);
      else
        res.status(200).json(result);
    });
  }

  return LegendaController;
}