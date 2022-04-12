const { response } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { genJWT } = require("../helpers/gen-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async( req, res = response ) =>{

    const { id_token } = req.body;

    try {
        
        const { name, img, email } = await googleVerify( id_token );

        //Verificar si el correo ya existe
        let user = await User.findOne({ email });

        if(!user) {

            const data = {
                name,
                email,
                password: ':p',
                img,
                google: true
            };

            user = new User( data );
            await user.save();
        }


        //Si el usuario en DB tiene status false
        if(!user.status){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario deshabilitado'
            });
        }

        //generar el jwt
        const token = await genJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'No se pudo verificar el token'
        })
    }

    

}

module.exports = {
    login,
    googleSignIn
}