const { response, request } = require('express');

const usersGet = (req = request, res = response) => {

    const { q, nombre = 'No name', apikey, page = '1', limit } = req.query;

    res.json({
        msg: 'get API - Controller',
        q,
        nombre,
        apikey,
        page,
        limit
    });

}

const usersPut = (req, res) => {

    const { id } = req.params;

    res.json({
        msg: 'put API - Controller',
        id
    });

}

const usersPost = (req, res) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - Controller',
        nombre,
        edad
    });

}

const usersDelete = (req, res) => {

    res.json({
        msg: 'del API - Controller'
    });

}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete
}