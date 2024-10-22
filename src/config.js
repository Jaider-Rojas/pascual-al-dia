const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb://localhost:27017/pascualDB");

connect.then(() => {
    console.log("Se ha conectado a la base de datos correctamente.")
}).catch(() => {
    console.log("No se pudo conectar a la base de datos.")
});

const LoginSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    clave: {
        type: String,
        required: true
    }
});

const usuariosCollection = mongoose.model("usuarios", LoginSchema);

const eventSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  fechaInicio: Date,
  fechaFin: Date,
  ubicacion: String,
  categoria: String,
  organizador: String,
  instructivos: String,
  imagenes: [String],
  comentarios: [{
    usuario: String,
    texto: String,
    fecha: Date
  }]
});

const eventosCollection = mongoose.model("eventos", eventSchema);


const noticiaSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
    autor: String,
    categoria: {
        type: String,
        required: true
    },
    destacada: {
        type: Boolean,
        default: false
    },
    enlaces: [{
        type: String
    }],
    comentarios: [{
        usuario: String,
        texto: String,
        fecha: Date
    }]
});

const noticiasCollection = mongoose.model("noticias", noticiaSchema);

module.exports = { usuariosCollection, eventosCollection, noticiasCollection };