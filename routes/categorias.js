const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, 
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria } 
     = require('../controllers/categorias_controller');
const { validarJWT, esAdminRole } = require('../middlewares');
const {validarCampos} = require('../middlewares/validar-campos');
const {existeCategoriaPorId} = require('../helpers/db-validators');

const router = Router();

// api/categorias
//obtener todas las categorias - publico,cualquiera lo puede ver 
router.get('/',obtenerCategorias);

//obtener una categoria en particular por id-privado solo usuario lo pueden ejecutar
router.get('/:id',[
    check('id','no es un ID de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
],obtenerCategoria);

//crear categoria-privado-cualquier persona con cualquier rol con token valido
router.post('/',[
validarJWT,
check('nombre','El nombre es obligatorio').not().isEmpty(),
validarCampos
],crearCategoria);

//actualizar -privado-cualquiera con token valido
router.put('/:id',[
    //necesito saber que alguien registrado esta haciendo este cambio 
    validarJWT,
    // el nombre es el producto que hay que actualizar 
check('nombre','El nombre es obligatorio').not().isEmpty(),
// verificar que el id del producto exista 
check('id').custom(existeCategoriaPorId),
validarCampos
],actualizarCategoria);

//borrar solo con rol de administrador
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','no es un ID de mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),


    validarCampos
],borrarCategoria);

module.exports = router;