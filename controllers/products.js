const { response } = require("express");
const { Product } = require("../models");

// getProducts - paginado - total - con populate
const getProducts = async(req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = {status: true};
    
    const [ total, products ] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate('category', 'name')
        .populate('user', 'name')
        .then()
        .catch(error=>console.log(error))
    ]);

    res.json({
        total,
        products
    });

}

// getCategory - populate - unicamente regresar el object de la categoria
const getProduct = async(req, res = response) => {

    const { id } = req.params;

    const product = await Promise.all([
        Product.findById(id)
        .populate('category', 'name')
        .populate('user', 'name')
        .then()
        .catch(error=>console.log(error))
    ]);;

    res.json({
        product
    });

}


const createProduct = async(req, res = response) => {

    const { status, user, ...body } = req.body;

    const productDB = await Product.findOne({name: body.name});

    if ( productDB ) {//if the element exist in DB then it will execute the res.status
        return res.status(400).json({
            msg: `The Product ${productDB.name} already exist`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    }

    const product = await new Product( data );// crea y prepara el producto sin guardarlo aun en DB

    //Guardar DB
    await product.save();

    res.status(201).json(product);

}

//updateProduct - solo recibir el nombre para actualizarlo, no debe existir el otro nombre
const updateProduct = async(req, res = response) => {

    const {id} = req.params;
    const { status, user, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product);

}

//deleteProduct - cambiar status a false
const deleteProduct = async(req, res = response) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { status: false });

    res.json({
        msg: `Product with id: ${id}, has been deleted successfully`,
        product
    });
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}
