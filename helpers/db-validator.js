const { Category, Role, User, Product } = require('../models');

//Validar si un rol es valido comparando con los disponibles en la DB
const validRoles = async(role = '') => {
    const role_Exists = await Role.findOne({ role });
    if ( !role_Exists ) {
            throw new Error(`El rol ${role} no se encuentra registrado en la DB`);
    }
}

//Validar si un correo ya esta registrado en la DB
const emailValidator = async(email = '') => {
    
    const emailExists = await User.findOne({ email });
    if ( emailExists ){
        throw new Error(`El correo: ${email}, ya se encuentra registrado`);
    }

}

//Validar si un usuario existe en la DB -- validador personalizado
const userExistingId = async(id = '') => {
    
    const userExisting = await User.findById(id);
    if ( !userExisting ){
        throw new Error(`No existe un usuario con el id: ${id}`);
    }

}

//Validar si la categoria existe en la DB -- validador personalizado
const categoryExistingId = async(id = '') => {
    
    const categoryExisting = await Category.findById(id);
    if ( !categoryExisting ){
        throw new Error(`No existe una categoria con el id: ${id}`);
    }

}

//Validar si el producto existe en la DB -- validador personalizado
const productExistingId = async(id = '') => {
    
    const productExisting = await Product.findById(id);
    if ( !productExisting ){
        throw new Error(`No existe un producto con el id: ${id}`);
    }

}

//Validar las colecciones permitidas
const allowedCollections = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`);
    }
    
    return true;

}

module.exports = {
    validRoles,
    emailValidator,
    userExistingId,
    categoryExistingId,
    productExistingId,
    allowedCollections
}