const { Router } = require('express');
const { check } = require('express-validator');

const { valFields } = require('../middlewares/val-fields');

const { login } = require('../controllers/auth');


const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    valFields
],login);


module.exports = router;