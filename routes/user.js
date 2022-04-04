const { Router } = require('express');
const { check } = require('express-validator');

/*const { validarCampos } = require('../middlewares/validar-campos');
const { valJWT } = require('../middlewares/jwt-validate');
const { adminRole, hasRole } = require('../middlewares/role-validation');*/
const {
        valFields, 
        valJWT, 
        adminRole, 
        hasRole
} = require('../middlewares');

const { validRoles, emailValidator, userExistingId } = require('../helpers/db-validator');

const { usersGet, 
        usersPut, 
        usersPost, 
        usersDelete,
        usersPatch } = require('../controllers/user');


const router = Router();

router.get('/', usersGet);

router.put('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( userExistingId ),
        check('role').custom( validRoles ),
        valFields
], usersPut);

router.post('/', [//arreglo de middlewares express-validator
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo ingresado no es válido').isEmail(),
        check('email').custom( emailValidator ),
        check('password', 'La contraseña es obligatoria y debe contener un mínimo de 8 caracteres').isLength({ min: 8 }),
        //check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('role').custom( validRoles ), //recibe el valor a evaluar del body en este caso el rol
        valFields //middleware propio
], usersPost);

router.delete('/:id', [
        valJWT,//si este da error no ejecutara el resto, por eso este middleware debe ser el primero en ejecutarse
        adminRole,//este middleware obliga a que sea admin
        hasRole('ADMIN_ROLE', 'SALES_ROLE', 'OTRO_ROLE'), //este dice que puede cualquiera de los roles especificados
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( userExistingId ),
        valFields
], usersDelete);

router.patch('/', usersPatch)

module.exports = router;