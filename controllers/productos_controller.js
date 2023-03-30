




const { response, request } = require('express');
const  Producto = require('../models/producto');


const crearProducto = async (req,res = response)=>{

    //excluyo el estado y el usuario ya que esos no son modificables 
const {estado,usuario,...body} = req.body;

const productoDB = await Producto.findOne({nombre: body.nombre});
if(productoDB){
    return res.status(400).json({
        msg:`El producto ${productoDB.nombre},ya existe`
    });
}

const data = {
    ...body,
    nombre:body.nombre.toUpperCase(),
    usuario:req.usuario._id
}

const producto = new Producto(data);
await producto.save();

res.status(201).json(producto);



}


const obtenerProductosGeneral = async (req= request,res = response)=>{
    const {limite = 5 ,desde=0} = req.body;

    const query = {estado:true}

    const [total,productos]= await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })


}


const obtenerProductosPorID = async (req= request,res=response)=>{

const {id} = req.params;
const producto = await Producto.findById(id).populate('categoria','nombre');

res.json(producto)

}

const actualizarProductoPorId = async (req,res=response)=>{

    const {id} = req.params;
    console.log(id);
    const {estado,usuario,...data} = req.body;

    data.nombre = data.nombre.toUpperCase();

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id,data,{new:true});
    console.log(producto);

    res.json(producto);

}


const borrarProducto = async (req,res=response) => {
    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id,{estado:false});

    res.json(producto)
}



module.exports = {
    crearProducto,
    obtenerProductosGeneral,
    obtenerProductosPorID,
    actualizarProductoPorId,
    borrarProducto
}