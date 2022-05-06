const { Router } = require('express');
const { check } = require('express-validator');
const { valJWT, adminRole } = require('../middlewares');
const { valFields } = require('../middlewares/val-fields');

const { categoryExistingId } = require('../helpers/db-validator');

const { createCategory, 
        getCategories, 
        getCategory,
        updateCategory,
        deleteCategory} = require('../controllers/categories');

const router = Router();

/**
 * {{url}}/api/categories
 */

// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( categoryExistingId ),//validacion personalizada para categoria
    valFields
], getCategory);

// Crear una nueva categoria - privado - cualquier persona con token valido
router.post('/', [
    valJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    valFields
], createCategory);

// Actualizar un registro por id - privado - token valido
router.put('/:id',[
    valJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( categoryExistingId ),
    valFields
], updateCategory);

// Borrar una categoria (Pasar a inactivo)- Solo Admin
router.delete('/:id', [
    valJWT,
    adminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( categoryExistingId ),
    valFields
], deleteCategory);


module.exports = router;