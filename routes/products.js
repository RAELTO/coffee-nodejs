const { Router } = require('express');
const { check } = require('express-validator');
const { valJWT, adminRole } = require('../middlewares');
const { valFields } = require('../middlewares/val-fields');

const { productExistingId, categoryExistingId } = require('../helpers/db-validator');

const { createProduct, 
        getProducts, 
        getProduct,
        updateProduct,
        deleteProduct} = require('../controllers/products');

const router = Router();

/**
 * {{url}}/api/products
 */

// Obtener todos los productos - publico - paginado
router.get('/', getProducts);

// Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'It is not a valid mongodb ID').isMongoId(),
    check('id').custom( productExistingId ),//validacion personalizada para categoria
    valFields
], getProduct);

// Crear un nuevo producto - privado - cualquier persona con token valido
router.post('/', [
    valJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('category', 'It is not a valid mongodb ID').isMongoId(),
    check('category').custom( categoryExistingId ),
    valFields
], createProduct);

// Actualizar un registro por id - privado - token valido
router.put('/:id',[
    valJWT,
    //check('id', 'It is not a valid mongodb ID').isMongoId(),
    check('id').custom( productExistingId ),
    valFields
], updateProduct);

// deletes a product (status to false)- ADMIN only
router.delete('/:id', [
    valJWT,
    adminRole,
    check('id', 'It is not a valid mongodb ID').isMongoId(),
    check('id').custom( productExistingId ),
    valFields
], deleteProduct);


module.exports = router;