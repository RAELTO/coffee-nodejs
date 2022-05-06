const { response } = require("express");
const { ObjectId } = require("mongoose").Types;//dentro de los types de mongoose existe la funcion ObjectId

const { User, Category, Product } = require('../models');

const validCollections = [//valid collections
    'categories',
    'products',
    'role',
    'users'
];

const searchUsers = async( term='', res = response ) => {

    const isMongoID = ObjectId.isValid(term);// Se usa el objectid, si es un id de mongo regresa true sino false

    if (isMongoID) {
        const user = await User.findById(term);
        return res.json({
            results: ( user ) ? [ user ] : []//condicional ternario, si el usuario existe entonces(?) regreso el arreglo con usuario [user] sino(:) regreso un array vacio[]
        })//{} means I'll send an object as response
    }

    //si no cumple ejecuta esta linea de codigo
    const regex = new RegExp(term, 'i'); //expresion regular del termino insensible a mayusculas o minusculas, no hay que importar, viene por defecto en JS

    const users = await User.find({
        $or: [{name: regex}, {email: regex}],//busca o el nombre o el correo con regex y status para users activos
        $and: [{status: true}]//debe cumplir las 3 condiciones para no regresar null, o nombre o correo y status
        //es propio de mongo $or $and etc
    });//en este caso si retorna varios usuarios lo manda como arreglo, si no hay usuarios retorna un array vacio

    res.json({
        results: users
    })

}

const searchCategory = async( term='', res = response ) => {

    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const category = await Category.findById(term);
        return res.json({
            results: ( category ) ? [ category ] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const category = await Category.find({name:regex, status: true});

    res.json({
        results: category
    })

}


const searchProducts = async( term='', res = response ) => {

    const isMongoID = ObjectId.isValid(term);

    if (isMongoID) {
        const product = await Product.findById(term).populate('category', 'name');
        return res.json({
            results: ( product ) ? [ product ] : []
        })
    }

    const regex = new RegExp(term, 'i');
    const product = await Product.find({name: regex, status: true}).populate('category', 'name');;

    res.json({
        results: product
    })

}

const search = (req, res = response) => {

    const { collection, term } = req.params;

    //If the given collection (by url) is not in list(validCollections), it will show the msg
    if(!validCollections.includes(collection)){
        return res.status(400).json({
            msg: `Use only the valid collections: ${validCollections}`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
        break;
        case 'categories':
            searchCategory(term, res);
        break;

        case 'products': 
            searchProducts(term, res);
        break;
        
        default:
            res.status(500).json({
                msg: 'The search for this collection is not enabled yet'
            })
    }

}


module.exports = {
    search
}
