function DbConnection(nomeCollection) {
	this.mongoClient = require('mongodb').MongoClient;
	this.nomeCollection = nomeCollection;
}

DbConnection.prototype.executaConsulta = function (callback) {
	this.mongoClient.connect('mongodb://localhost', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
		.then(conn => callback(conn.db('Desafio_Crawler_Fliper')))
		.catch(err => console.log(err));
};

DbConnection.prototype.consultaTodos = function (callback) {
	this.executaConsulta((connection) => {
		connection.collection(this.nomeCollection).find().toArray(callback);
	});
}

DbConnection.prototype.consultaUnico = function (filtro, callback) {
	return this.executaConsulta((connection) => {
		connection.collection(this.nomeCollection).findOne(filtro).then(callback);
	});
}

DbConnection.prototype.insere = function (objeto, callback) {
	return this.executaConsulta((connection) => {
		connection.collection(this.nomeCollection).insertOne(objeto).then(callback);
	});
}

DbConnection.prototype.atualiza = function (filtro, objeto, callback) {
	return this.executaConsulta((connection) => {
		connection.collection(this.nomeCollection).updateOne(filtro, { $set: objeto }).then(callback);
	});
}

module.exports = function () {
	return DbConnection;
}