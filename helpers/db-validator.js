const Role = require('../models/role');
const User = require('../models/user');

const validRoles = async(role = '') => {
    const role_Exists = await Role.findOne({ role });
    if ( !role_Exists ) {
            throw new Error(`El rol ${role} no se encuentra registrado en la DB`);
    }
}

const emailValidator = async(email = '') => {
    
    const emailExists = await User.findOne({ email });
    if ( emailExists ){
        throw new Error(`El correo: ${email}, ya se encuentra registrado`);
    }

}

const userExistingId = async(id = '') => {
    
    const userExisting = await User.findById(id);
    if ( !userExisting ){
        throw new Error(`No existe un usuario con el id: ${id}`);
    }

}

module.exports = {
    validRoles,
    emailValidator,
    userExistingId
}