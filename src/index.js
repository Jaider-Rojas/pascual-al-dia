const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("inicio");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        // Buscar el usuario por su correo
        const user = await collection.findOne({ correo: req.body.email });

        if (!user) {
            return res.send("El correo ingresado es inválido.");
        }

        const usuarioClave = user.clave;

        if (req.body.password === usuarioClave) {
            res.render("inicio");
        } else {
            res.send("La contraseña ingresada es incorrecta.");
        }
    } catch (err) {
        console.error("Error capturado:", err);
        res.send("Ocurrió un error inesperado.");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`El servidor está abierto en el puerto: ${port}`);
});
