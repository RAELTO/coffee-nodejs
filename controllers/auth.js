const { response } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { genJWT } = require("../helpers/gen-jwt");

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        //Verificar si el email existe
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                msg: "Usuario / Contraseña incorrecta - email"
            });
        }
        
        //Verificar si el usuario esta activo
        if(!user.status){
            return res.status(400).json({
                msg: "Usuario / Contraseña incorrecta - status: false"
            });
        }

        // Verficiar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );//compara la passw del body vs la del usuario, retorna un booleano
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario / Contraseña incorrecta - password"
            });
        }

        // Generar el JWT
        const token = await genJWT( user.id );


        res.json({
            user,
            token
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Consulte con el administrador"
        })
    }

}

module.exports = {
    login
}