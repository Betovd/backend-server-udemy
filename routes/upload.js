var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');



app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));



app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposColeccion = ['usuarios', 'hospitales', 'medicos'];

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se encontro el archivo',
            error: { message: 'Debe de seleccionar una imagen' }
        });
    }

    if (tiposColeccion.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Colección invalida',
            error: { message: 'los tipos de coleción validos son:' + tiposColeccionq.join(', ') }
        });


    }


    // obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    /// Solo extenciones aceptadas

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            error: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });
    }

    /// nombre de Archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;


    //// Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;


    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar archivo.',
                error: err
            });
        }

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo cargado correctamente',
        // });

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(200).json({
                    ok: false,
                    mensaje: 'El Usuario no existe',
                    erros: { message: 'El Usuario No Existe' }
                });

            }

            var pathViejo = './uploads/usuarios/' + usuario.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al cargar archivo.',
                            error: err
                        });
                    }
                });
            }


            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actulizada.',
                    usuarioActualizado: usuarioActualizado
                });

            });

        });

    }



    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(200).json({
                    ok: false,
                    mensaje: 'El Hospital no existe',
                    erros: { message: 'El Hospital No Existe' }
                });

            }

            var pathViejo = './uploads/hospitales/' + hospital.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al cargar archivo.',
                            error: err
                        });
                    }
                });
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actulizada.',
                    hospitalActualizado: hospitalActualizado
                });

            });

        });

    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(200).json({
                    ok: false,
                    mensaje: 'El medico no existe',
                    erros: { message: 'El medico No Existe' }
                });

            }

            var pathViejo = './uploads/medicos/' + medico.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al cargar archivo.',
                            error: err
                        });
                    }
                });
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actulizada.',
                    medicoActualizado: medicoActualizado
                });

            });

        });

    }


}

module.exports = app;