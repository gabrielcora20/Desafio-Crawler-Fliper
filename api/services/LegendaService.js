function LegendaService(app) {
	this._repositorioLegenda = new app.data.DbConnection("legendas");
}

LegendaService.prototype.obtemLegendas = function (callback) {
	this._repositorioLegenda.consultaTodos(callback);
}

LegendaService.prototype.obtemLegendaPorNome = function (nome, callback) {
	this._repositorioLegenda.consultaUnico({ nome: nome }, callback);
}

module.exports = function () {
	return LegendaService;
}