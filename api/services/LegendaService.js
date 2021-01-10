function LegendaService(app) {
	this._repositorioLegenda = new app.data.DbConnection("legendas");
}

LegendaService.prototype.obtemLegendas = function (callback) {
	this._repositorioLegenda.consultaTodos(callback);
}

LegendaService.prototype.obtemLegenda = function (filtro, callback) {
	this._repositorioLegenda.consultaUnico(filtro, callback);
}

LegendaService.prototype.verificaExistenciaLegenda = function (filtro, callback) {
	this._repositorioLegenda.consultaLegendas(filtro, callback).length == 0;
}

LegendaService.prototype.salvaLegenda = function (legenda, callback) {
	this._repositorioLegenda.insere(legenda, callback);
}

module.exports = function () {
	return LegendaService;
}