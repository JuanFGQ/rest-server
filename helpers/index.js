const dbValidator = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir_archivo');


module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}