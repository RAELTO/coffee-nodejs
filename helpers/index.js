
const dbValidator = require('./db-validator');
const genJWT = require('./gen-jwt');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');

module.exports = {
    ...dbValidator,//los tres puntos indican que exportan todo su contenido
    ...genJWT,
    ...googleVerify,
    ...uploadFile
}