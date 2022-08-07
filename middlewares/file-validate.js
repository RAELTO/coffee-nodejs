const { response } = require("express");

const validateFileUpload = (req, res = response, next) => {//los middlewares usan next

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {//preguntar si en la request viene la propiedad file
        //.file se refiere al nombre dentro de la peticion, en el caso de postman al key del form-data
        return res.status(400).json({
            msg: 'No hay archivos para subir - ValidateFileUpload'
        });

    }

    next();

}

module.exports = {
    validateFileUpload
}