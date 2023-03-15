const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria } = require('../controllers/categorias_controller');
const { validarJWT } = require('../middlewares');
const {validarCampos} = require('../middlewares/validar-campos')


const router = Router();

// api/categorias
//obtener todas las categorias - publico
router.get('/',(req,res )=> {
    res.json('todo ok')
});

//obtener una categoria en particular por id 
router.get('/:id',(req,res )=> {
    res.json('get-id')
});

//crear categoria-privado-cualquier persona con cualquier rol con token valido
router.post('/',[validarJWT,
check('nombre','El nombre es obligatorio').not().isEmpty(),
validarCampos
],crearCategoria);

//actualizar -privado-cualquiera con token valido
router.put('/:id',(req,res )=> {
    res.json('put-actualizar')
});

//borrar solo con rol de administrador
router.delete('/:id',(req,res )=> {
    res.json('todo ok')
});

module.exports = router;