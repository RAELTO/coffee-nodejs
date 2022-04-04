
const valFields = require('./val-fields');
const valJWT = require('../middlewares/jwt-validate');
const roleValidation = require('../middlewares/role-validation');



module.exports = {
    ...valFields,
    ...valJWT,
    ...roleValidation
}

