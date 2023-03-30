const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagenes, mostrarImagen, actualizarImagenesCloudinary } = require('../controllers/uploads_controller');
const { validarArchivoSubir } = require('../middlewares');


const { validarCampos } = require('../middlewares/validar-campos');




const router = Router();

router.post('/',validarArchivoSubir,cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','el id debe de ser de mongo').isMongoId(),
    /*
    mando la coleecion que recibo en el put y el segundo argumento son los
    las opciones que voy a recibir //*198
    */
    check('coleccion', 'no es una coleccion permitida').isIn(['usuarios', 'productos']),

    // check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios,productos'])),
    validarCampos
],
actualizarImagenesCloudinary
// actualizarImagenes
)

//*202
router.get('/:coleccion/:id',[
    check('id','el id debe de ser de mongo').isMongoId(),
    check('coleccion', 'no es una coleccion permitida').isIn(['usuarios', 'productos']),

    validarCampos
],mostrarImagen)


module.exports = router;