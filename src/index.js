const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const { usuariosCollection, eventosCollection } = require("./config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.use(express.static("public"));


app.get("/", async (req, res) => {
    const eventos = await eventosCollection.find();

    res.render("inicio", { eventos });
});

app.get("/inicioadmin", async (req, res) => {
    const eventos = await eventosCollection.find();

    res.render("inicioadmin", { eventos });
});

app.get("/editareventos/:id", async (req, res) => {
    const evento = await eventosCollection.findById(req.params.id);
    if (!evento) {
        return res.status(404).send("Evento no encontrado");
    }
    res.render("editareventos", { evento });
});

app.post("/editareventos/:id", async (req, res) => {
    try {
        const { nombre, descripcion, fechaInicio, fechaFin, ubicacion, categoria } = req.body;
        await eventosCollection.findByIdAndUpdate(req.params.id, {
            nombre,
            descripcion,
            fechaInicio,
            fechaFin,
            ubicacion,
            categoria,
        });
        res.redirect("/inicioadmin");
    } catch (err) {
        console.error("Error capturado:", err);
        res.send("Ocurrió un error inesperado.");
    }
});

app.post("/eliminareventos/:id", async (req, res) => {
    try {
        await eventosCollection.findByIdAndDelete(req.params.id);
        res.redirect("/inicioadmin");
    } catch (err) {
        console.error("Error capturado:", err);
        res.send("Ocurrió un error inesperado.");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {

        const eventos = await eventosCollection.find();
        const user = await usuariosCollection.findOne({ correo: req.body.email });

        if (!user) {
            return res.send("El correo ingresado es inválido.");
        }

        const usuarioClave = user.clave;

        if (req.body.password === usuarioClave) {
            res.render("inicioadmin", { eventos });
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
