


const { Router } = require('express');
const { check } = require('express-validator');


const { crearProducto, 
    obtenerProductosGeneral, 
    obtenerProductosPorID, 
    actualizarProductoPorId, 
    borrarProducto} = require('../controllers/productos_controller');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, esAdminRole } = require('../middlewares');
const {validarCampos} = require('../middlewares/validar-campos');

const router = Router();


router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],
crearProducto
);

router.get('/',obtenerProductosGeneral);

router.get('/:id',[
    check('id','No un ID de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
],obtenerProductosPorID);


router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProductoPorId);


router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', ' no es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto);




module.exports = router;
