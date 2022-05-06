const { Schema, model } = require('mongoose');

const CategorySchema = Schema({

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

CategorySchema.methods.toJSON = function(){
    const { __v, status, ...data } = this.toObject();//solo requiero el nombre y el _id de la categoria

    return data;
}

module.exports = model( 'Category', CategorySchema );