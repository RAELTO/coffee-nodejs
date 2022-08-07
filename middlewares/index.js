
const valFields = require('./val-fields');
const valJWT = require('../middlewares/jwt-validate');
const roleValidation = require('../middlewares/role-validation');
const validateFileUpload = require('../middlewares/file-validate');



module.exports = {
    ...valFields,
    ...valJWT,
    ...roleValidation,
    ...validateFileUpload
}

