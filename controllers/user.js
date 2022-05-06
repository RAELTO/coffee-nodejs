const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');


const usersGet = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;//argumentos opcionales del query
    const query = {status: true};
    
    //total y users son los resultados de la primera y segunda promesa en ese orden
    const [ total, users ] = await Promise.all([//coleccion de promesas
        User.countDocuments(query),
        User.find(query)//en el find se puede mandar un object con la condicion - en este caso status: true que dice que el usuario esta activo
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });

}

const usersPost = async(req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // pass encrypt
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );//encriptacion de una sola via
    
    //guardar en DB
    await user.save();

    res.json({
        msg: 'post API - Controller',
        user
    });

}

const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...remainData } = req.body; 

    if( password ){
        const salt = bcryptjs.genSaltSync();
        remainData.password = bcryptjs.hashSync( password, salt );//encriptacion de una sola via
    }

    const user = await User.findByIdAndUpdate( id, remainData, {new: true}/*retorna el usuario actualizado*/ );
    // si no se pone el {new: true} regresa el usuario como estaba antesde actualizarse
    res.json(user);

}

const usersPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - Controller'
    });

}

const usersDelete = async(req, res = response) => {

    const { id } = req.params;

    const uid = req.uid;

    const user = await User.findByIdAndUpdate(id, { status: false });

    res.json({
        msg: `User with id: ${id}, has been deleted successfully`,
        user
    });

}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch
}