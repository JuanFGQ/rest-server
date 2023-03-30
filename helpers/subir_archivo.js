
//crea el url de la carpeta destino //*193
const path = require('path');
const {v4:uuidv4}= require('uuid');//*195
      //validar extensiones, declarar las extensiones validas //*194-//*196

const subirArchivo = (files,extensionesValidas = ['png','jpg','jpeg','gif'],carpeta  ='') =>{

    return new Promise((resolve,reject) => {


        /*
  aqui establece lo que biene el la request.files.archivo
  */
  const {archivo} = files;

  //el split me permite cortar el string y el punto es el identificador 
  //que voy  a usar para separarlo y crear mi arreglo //*194
      const nombreCortado = archivo.name.split('.');
  
  //sacar la extension del archivo, es la ultima posicion en el arreglo //*194
      const extension = nombreCortado [ nombreCortado.length - 1 ];
  

      //si extension no incluye alguna de las de la lista entonces error
      if(!extensionesValidas.includes(extension)){
        return reject ( `La extension : ${extension} no es permitida, ${extensionesValidas}` ); //*196
    
      }
  
  //nombre temporal para el archivo guardado , creado por el paquete de uuid
      const nombreTemporal = uuidv4() + '.' + extension;
    //el name , es el nombre que nos muestra en la consola cuando enviamos un archivo desde postman
    const  uploadPath = path.join(__dirname , '../uploads/' ,carpeta, nombreTemporal);
    
      archivo.mv(uploadPath, (err)=> {
        if (err) {
            reject(err);
        }
    
       resolve(nombreTemporal);
      });

    });
    
 
}

module.exports = {
    subirArchivo
}