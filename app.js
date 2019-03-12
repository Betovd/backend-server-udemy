// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



// Inicializar variables
var app = express();


// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// Exportar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var loginRoutes = require('./routes/login');
var appUpload = require('./routes/upload');
var imagenesUpload = require('./routes/imagenes');

// Conección a la base de datos
// mongoose.connection('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }.then(

//     (err) => {

//         if (err) throw err;
//         console.log('Base de datos online: \x1b[32m%s\x1b[0m', 'online');
//     }));



// Or using promises
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useCreateIndex: true, }).then(
    () => { console.log('Base de datos online: \x1b[32m%s\x1b[0m', 'online'); },
    err => { throw err }
);




// Rutas
app.use('/login', loginRoutes);
app.use('/img', imagenesUpload);
app.use('/upload', appUpload);
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/', appRoutes);


// Escuchar peticiones

app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});