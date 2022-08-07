const path = require('path');//metodo util para poder crear los url
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise((resolve, reject) => {

        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        //Validar la extension
        if ( !extensionesValidas.includes(extension) ) {
            return reject(`La extension ${extension} no es permitida, solo son permitidas: ${extensionesValidas}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve( nombreTemp );
        });
    });


}

module.exports = {
    uploadFile
}