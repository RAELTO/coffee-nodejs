const { Router } = require('express');
const { check } = require('express-validator');

const { valFields, validateFileUpload } = require('../middlewares');
const { fileToFolder, updateImage, showImage } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');


const router = Router();

router.post('/', validateFileUpload, fileToFolder);

router.put('/:coleccion/:id', [
    validateFileUpload,
    check('id', 'A valid mongodb id must be provided').isMongoId(),
    check('coleccion').custom( c => allowedCollections(c, ['users', 'products']) ),
    valFields
], updateImage);

router.get('/:coleccion/:id', [
    check('id', 'A valid mongodb id must be provided').isMongoId(),
    check('coleccion').custom( c => allowedCollections(c, ['users', 'products']) ),
    valFields
], showImage);

module.exports = router;