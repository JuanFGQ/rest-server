const { response } = require("express")



//si en postman estoy mandando algun archivo , si no , da el error.
  //si no viene ninguna  propiedad en los files tambien da error //*193

//*200
const validarArchivoSubir = (req,res = response,next) =>{

    //verifico que hay archivo, verifico que se mas de 0, verifico que el parametro se llame archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({msg:'no hay archivos que subir '});
        
      }
      next();

}

module.exports = {
    validarArchivoSubir
}