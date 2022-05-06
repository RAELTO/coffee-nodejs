const { response } = require('express');
const { Category } = require('../models');//apunta automaticamente al index de los modelos


// getCategories - paginado - total - con populate
const getCategories = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = {status: true};
    
    const [ total, categories ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate('user', 'name')//metodo que retorna los datos del user id asociado a la categoria, si se deja sin , '' retorna todos los datos, si se especifica retorna un dato individiaul como 'name'
        .then()
        .catch(error=>console.log(error))
    ]);

    res.json({
        total,
        categories
    });

}

// getCategory - populate - unicamente regresar el object de la categoria
const getCategory = async(req, res = response) => {

    const { id } = req.params;

    const category = await Promise.all([
        Category.findById(id)
        .populate('user', 'name')
        .then()
        .catch(error=>console.log(error))
    ]);;

    res.json({
        category
    });

}

const createCategory = async(req, res = response) => {

    const name = req.body.name.toUpperCase();//transformo el nombre de categoria a mayusc
    //sirve para evitar duplicados por minisculas

    const categoryDB = await Category.findOne({name});

    if ( categoryDB ) {//si la categoria existe ejecuta
        return res.status(400).json({
            msg: `The Category ${categoryDB.name} already exist`
        });
    }

    //Generar la data a guardar
    const data = {//determino que datos se van a guardar
        name,
        user: req.user._id//guarda el usuario que se identifico con el JWT
    }

    const category = await new Category( data );// crea y prepara la categoria sin guardarlo aun en DB

    //Guardar DB
    await category.save();

    res.status(201).json(category);

}

//updateCategory - solo recibir el nombre para actualizarlo, no debe existir el otro nombre
const updateCategory = async(req, res = response) => {

    const {id} = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json(category);

}

//deleteCategory - cambiar status a false
const deleteCategory = async(req, res = response) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, { status: false });

    res.json({
        msg: `Category with id: ${id}, has been deleted successfully`,
        category
    });
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}