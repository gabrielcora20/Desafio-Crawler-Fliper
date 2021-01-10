const app = require('./config/express')();
const port = app.get('port');
const path = require('path');

// consign()
	// .include('./api/Routes')
	// .then('./config/DbConnection.js')
	// .then('./api/Services')
	// .then('./api/Data')
	// .then('./api/Controllers')
	// .into(app);

// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
});


// var express = require('express');
// var consign = require('consign');
// var bodyParser = require('body-parser');
// var expressValidator = require('express-validator');

// var app = express();
// app.set('view engine', 'ejs');
// app.set('views', './app/views');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(expressValidator());


// module.exports = app;