const { Router } = require('express');
const { check } = require('express-validator');

const { valFields } = require('../middlewares/val-fields');

const { login, googleSignIn } = require('../controllers/auth');


const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    valFields
],login);

router.post('/google', [
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    valFields
], googleSignIn);


module.exports = router;