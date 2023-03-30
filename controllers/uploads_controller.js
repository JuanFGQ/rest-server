
//*193

const path = require('path');
const fs = require('fs');

//*205
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);//*205



const { response } = require("express");

const { subirArchivo } = require("../helpers/subir_archivo");

const  {Usuario,Producto} = require('../models');

const cargarArchivo =async ( req,res= response)=>{

   
  //si en postman estoy mandando algun archivo , si no , da el error.
  //si no viene ninguna  propiedad en los files tambien da error //*193
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //   res.status(400).json({msg:'no hay aechivos que subir '});
    //   return;
    // }

    try {
      //imagenes //*196
      //cada uno de los argumentos que hay puestos van en orden segun los pide 
      //el metodo de subir archivo
//aqui le digo al back el tipo de archivos que puedo subir //*197
      // const nombre = await subirArchivo(req.files,['txt','md'],'textos');

   const nombre = await subirArchivo(req.files,undefined,'imgs'); //*197
   res.json({nombre});
      
    } catch (error) {
      res.status(400).json({error});
      
    }


}

//*199
const actualizarImagenes = async (req,res = response)=>{

const {id,coleccion }= req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo =await  Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: `no existe usuario con el id ${id}`
        })
      }
  break;
  case 'productos':
      modelo = await Producto.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg: `no existe producto con el id ${id}`
        });
      }
        break;
  
    default:
      return res.status(500).json({
        msg:'se me olvido validar esto'
      });
  }


  //limpiar imagenes previas //*201

  if(modelo.img){
    //borrar la imagen del servidor

    /*
    cuando coloco el ../ quiere decir que estoy yendo una carpeta atras
    */
    const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);

    // si la imagen existe en la carpeta del sistema, la elimina //*201
    if(fs.existsSync(pathImagen)){
      fs.unlinkSync(pathImagen);
    }

  }

  //el segundo argumento de subir archivo al estar undefined me permite guardar todas las 
  //imagenes que tengan la extension de la coleccion de extensiones del metodo 
  const nombre = await subirArchivo(req.files,undefined,coleccion); //*199
  
  //img es el nombre que tienen en el schema de usuarios y productos
  modelo.img =  nombre;

  await modelo.save();

  
  res.json(modelo);

}



//*202
/*
obteniendo imagen 
*/

const mostrarImagen =async (req,res = response)=>{


  const {id,coleccion} = req.params;




let modelo;

switch (coleccion) {
  case 'usuarios':
    modelo =await  Usuario.findById(id);
    if(!modelo){
      return res.status(400).json({
        msg: `no existe usuario con el id ${id}`
      })
    }
break;
case 'productos':
    modelo = await Producto.findById(id);
    if(!modelo){
      return res.status(400).json({
        msg: `no existe producto con el id ${id}`
      });
    }
      break;

  default:
    return res.status(500).json({
      msg:'se me olvido validar esto'
    });
}


//limpiar imagenes previas //*201

if(modelo.img){
  //borrar la imagen del servidor

  /*
  cuando coloco el ../ quiere decir que estoy yendo una carpeta atras
  */
  const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img);

  // si la imagen existe en la carpeta del sistema, la elimina //*201
  if(fs.existsSync(pathImagen)){
    return res.sendFile(pathImagen)

  }

}

//funcion para enviar imagen vacia cuando el usuario no manda imagen
const placeholder = path.join(__dirname,'../assets/no-image.jpg')

res.sendFile(placeholder);

}

//*205
const actualizarImagenesCloudinary = async (req,res = response)=>{

  const {id,coleccion }= req.params;
  
    let modelo;
  
    switch (coleccion) {
      case 'usuarios':
        modelo =await  Usuario.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `no existe usuario con el id ${id}`
          })
        }
    break;
    case 'productos':
        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `no existe producto con el id ${id}`
          });
        }
          break;
    
      default:
        return res.status(500).json({
          msg:'se me olvido validar esto'
        });
    }
  
  
    //limpiar imagenes previas //*201
  
    if(modelo.img){

        const nombreArr = modelo.img.split('/');//*206
        const nombre = nombreArr[nombreArr.length - 1];//*206
        //el public_id es el id publico donde se encuentra la imagen //*206
       //corto el nombre por el punto .jpg donde la primera parte es el id de la imagen
        const [public_id] = nombre.split('.');

    
        //eliminar public id //*206
      await cloudinary.uploader.destroy(public_id);


        // console.log(public_id);
    }
    const {tempFilePath} = req.files.archivo
    const {secure_url} = await  cloudinary.uploader.upload(tempFilePath);
    //img es el nombre que tienen en el schema de usuarios y productos
    modelo.img =  secure_url;
    
    await modelo.save();
    
  
    res.json(modelo);
  
    
  
  }
  

module.exports= {
    cargarArchivo,
    actualizarImagenes,
    mostrarImagen,
    actualizarImagenesCloudinary
}