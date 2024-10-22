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
  organizador: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instructivos: String,
  imagenes: [String],
  comentarios: [{
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    texto: String,
    fecha: Date
  }]
});

const eventosCollection = mongoose.model("eventos", eventSchema);


module.exports = { usuariosCollection, eventosCollection };