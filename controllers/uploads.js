const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2

cloudinary.config( process.env.CLOUDINARY_URL );

const { response, request } = require("express");
const { uploadFile } = require('../helpers');

const { User, Product } = require('../models')

const fileToFolder = async(req, res = response) => {

    try {
        //files
        //const nombreArchivo = await uploadFile( req.files, ['pdf'], 'archivos' ); --> define el tipo de archivo(pdf) por sobre los predefinidos, crea la carpeta con nombre archivos
        const nombreArchivo = await uploadFile( req.files, undefined, 'images' );

        res.json({ nombreArchivo });
    } catch (error) {
        res.status(400).json({
            msg: error
        });
    }

};

const updateImage = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let model;

    switch (coleccion) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    //Limpiar imagenes previas
    if (model.img) {
        //Borrar la imagen del server
        const pathImage = path.join(__dirname, '../uploads', coleccion, model.img)
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }

    const nombreArchivo = await uploadFile( req.files, undefined, coleccion );
    model.img = nombreArchivo;

    await model.save();

    res.json({model});

};

const updateImageCloudinary = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let model;

    switch (coleccion) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    //Limpiar imagenes previas
    if (model.img) {
        const nombreArr = model.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.'); //id publico de cloudinary
        cloudinary.uploader.destroy( public_id ); //metodo de cloudinary que borra segun el public id
    }

    const { tempFilePath } = req.files.archivo

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    model.img = secure_url;

    await model.save();

    res.json({model});

};

const showImage = async (req, res = response) => {

    const {id, coleccion} = req.params;

    let model;

    switch (coleccion) {
        case 'users':
            model = await User.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    if (model.img) {
        const pathImage = path.join(__dirname, '../uploads', coleccion, model.img)
        if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
        }
    }

    const pathImage = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImage);

}

module.exports = {
    fileToFolder,
    updateImageCloudinary,
    showImage
};