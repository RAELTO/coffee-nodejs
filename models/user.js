
const { Schema, model} = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//metodos para editar o personalizar el Schema
UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user } = this.toObject();/*genera la instancia como objeto literal de JS y saca 
    el __v y el password y almacena el resto en user*/

    user.uid = _id; //muestra el _id como uid en las res, (_id se extrae previamente)

    return user;
}//debe ser una funcion normal en este caso por usar el this

module.exports = model( 'User', UserSchema );
