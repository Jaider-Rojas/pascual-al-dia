const express = require('express');
const path = require('path');
const bcrypt = require("bcrypt");
const { usuariosCollection, eventosCollection, noticiasCollection } = require("./config");

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

app.get("/noticias", async (req, res) => {
    const noticias = await noticiasCollection.find();

    res.render("noticias", { noticias });
});

app.get("/noticiasadmin", async (req, res) => {
    const noticias = await noticiasCollection.find();

    res.render("noticiasadmin", { noticias });
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

app.get("/editarnoticias/:id", async (req, res) => {
    const noticia = await noticiasCollection.findById(req.params.id);
    if (!noticia) {
        return res.status(404).send("Noticia no encontrada");
    }
    res.render("editarnoticias", { noticia });
});

app.post("/editarnoticias/:id", async (req, res) => {
    try {
        const { titulo, contenido, fechaPublicacion, autor, categoria, destacada, enlaces } = req.body;
        await noticiasCollection.findByIdAndUpdate(req.params.id, {
            titulo,
            contenido,
            fechaPublicacion,
            autor,
            categoria,
            destacada,
            enlaces,
        });
        res.redirect("/noticiasadmin");
    } catch (err) {
        console.error("Error capturado:", err);
        res.send("Ocurrió un error inesperado.");
    }
});

app.post("/eliminarnoticias/:id", async (req, res) => {
    try {
        await noticiasCollection.findByIdAndDelete(req.params.id);
        res.redirect("/noticiasadmin");
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
        const user = await usuariosCollection.findOne({ correo: req.body.correo.trim() });

        if (!user) {
            return res.send("El correo ingresado es inválido.");
        }

        const usuarioClave = user.clave;

        if (req.body.password == usuarioClave) {
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
