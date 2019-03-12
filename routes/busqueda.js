var express = require('express');

var mdAutentificacion = require('../middleweres/autentificacion');


var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ============================
// Busqueda por colleccion
// ============================

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        default:
            return res.status(200).json({
                ok: true,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no valida' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            /// propiedades de objeto computadas EMS6
            [tabla]: data
        });
    });
});



// ============================
// Busqueda en todo
// ============================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    ///// Metodos para manejar mas de una 2 o mas promesas

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});



///// Metodo de una sola promesa /////////

// buscarHospital(busqueda, regex)
//         .then(hospitales => {
//             res.status(200).json({
//                 ok: true,
//                 hospitales: hospitales
//             });
//         });
// });



function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email role img')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al caragar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}


function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital', 'nombre usuario img')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al caragar medico', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Problemas al cargar usuarios');
                } else {
                    resolve(usuarios);
                }

            });
    });
}




module.exports = app;