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
})

const collection = new mongoose.model("usuarios", LoginSchema);

module.exports = collection;
