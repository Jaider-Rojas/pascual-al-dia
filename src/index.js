const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const {
	usuariosCollection,
	eventosCollection,
	noticiasCollection
} = require("./config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use(express.static("public"));

let mensaje;
let msgestado;
let msgestilo;

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

	res.render("editareventos", {
		evento,
		mensaje: mensaje,
		msgestado: msgestado,
		msgestilo: msgestilo
	});
	msgestado = false;
});

app.post("/editareventos/:id", async (req, res) => {
	try {
		const {
			nombre,
			descripcion,
			fechaInicio,
			fechaFin,
			ubicacion,
			categoria,
			organizador,
			imagenes
		} = req.body;

		if (
			!nombre ||
			!descripcion ||
			!fechaInicio ||
			!fechaFin ||
			!ubicacion ||
			!categoria ||
			!organizador
		) {
			msgestado = true;
			msgestilo = false;
			mensaje = "Todos los campos son obligatorios.";
			return res.redirect(`/editareventos/${req.params.id}`);
		}

		const fechaInicioDate = new Date(fechaInicio);
		const fechaFinDate = new Date(fechaFin);
		if (isNaN(fechaInicioDate) || isNaN(fechaFinDate)) {
			msgestado = true;
			msgestilo = false;
			mensaje = "Las fechas deben ser válidas.";
			return res.redirect(`/editareventos/${req.params.id}`);
		}
		if (fechaInicioDate >= fechaFinDate) {
			msgestado = true;
			msgestilo = false;
			mensaje = "La fecha de inicio debe ser anterior a la fecha de fin.";
			return res.redirect(`/editareventos/${req.params.id}`);
		}

		await eventosCollection.findByIdAndUpdate(req.params.id, {
			nombre,
			descripcion,
			fechaInicio,
			fechaFin,
			ubicacion,
			categoria,
			organizador,
			imagenes
		});
		res.redirect("/inicioadmin");
	} catch (err) {
		console.error("Error capturado:", err);
		msgestado = true;
		msgestilo = false;
		mensaje = "Ocurrió un error inesperado.";
		return res.redirect(`/editareventos/${req.params.id}`);
	}
});

app.get("/creareventos", async (req, res) => {
	res.render("creareventos", {
		mensaje: mensaje,
		msgestado: msgestado,
		msgestilo: msgestilo
	});
	msgestado = false;
});

app.post("/creareventos", async (req, res) => {
	try {
		const {
			nombre,
			descripcion,
			fechaInicio,
			fechaFin,
			ubicacion,
			categoria,
			organizador,
			instructivos,
			imagenes
		} = req.body;

		if (
			!nombre ||
			!descripcion ||
			!fechaInicio ||
			!fechaFin ||
			!ubicacion ||
			!categoria ||
			!organizador
		) {
			msgestado = true;
			msgestilo = false;
			mensaje = "Todos los campos son obligatorios.";
			return res.redirect("/creareventos");
		}

		const fechaInicioDate = new Date(fechaInicio);
		const fechaFinDate = new Date(fechaFin);
		if (isNaN(fechaInicioDate) || isNaN(fechaFinDate)) {
			msgestado = true;
			msgestilo = false;
			mensaje = "Las fechas deben ser válidas.";
			return res.redirect("/creareventos");
		}
		if (fechaInicioDate >= fechaFinDate) {
			msgestado = true;
			msgestilo = false;
			mensaje = "La fecha de inicio debe ser anterior a la fecha de fin.";
			return res.redirect("/creareventos");
		}

		const nuevasEvento = new eventosCollection({
			_id: new mongoose.Types.ObjectId(),
			nombre,
			descripcion,
			fechaInicio: fechaInicioDate,
			fechaFin: fechaFinDate,
			ubicacion,
			categoria,
			organizador,
			instructivos,
			imagenes: imagenes ? imagenes.split(",") : [],
			comentarios: []
		});
		await eventosCollection.create(nuevasEvento);

		res.redirect("/inicioadmin");
	} catch (err) {
		console.error("Error capturado:", err);
		msgestado = true;
		msgestilo = false;
		mensaje = "Ocurrió un error inesperado.";
		res.redirect("/creareventos");
	}
});

app.get("/crearnoticias", async (req, res) => {
	res.render("crearnoticias", {
		mensaje: mensaje,
		msgestado: msgestado,
		msgestilo: msgestilo
	});
	msgestado = false;
});

app.post("/crearnoticias", async (req, res) => {
	try {
		const {
			titulo,
			contenido,
			fechaPublicacion,
			autor,
			categoria,
			destacada,
			enlaces
		} = req.body;

		if (
			!titulo ||
			!contenido ||
			!fechaPublicacion ||
			!autor ||
			!categoria
		) {
			msgestado = true;
			msgestilo = false;
			mensaje = "Todos los campos son obligatorios.";
			return res.redirect("/crearnoticias");
		}

		const fechaPublicacionDate = new Date(fechaPublicacion);
		if (isNaN(fechaPublicacionDate)) {
			msgestado = true;
			msgestilo = false;
			mensaje = "La fecha de publicación debe ser válida.";
			return res.redirect("/crearnoticias");
		}

		const nuevaNoticia = new noticiasCollection({
			_id: new mongoose.Types.ObjectId(),
			titulo,
			contenido,
			fechaPublicacion: fechaPublicacionDate,
			autor,
			categoria,
			destacada: destacada === "on",
			enlaces: enlaces
				? enlaces.split(",").map((enlace) => enlace.trim())
				: []
		});
		await noticiasCollection.create(nuevaNoticia);
		res.redirect("/noticiasadmin");
	} catch (err) {
		console.error("Error capturado:", err);
		msgestado = true;
		msgestilo = false;
		mensaje = "Ocurrió un error inesperado.";
		return res.redirect("/crearnoticias");
	}
});

app.get("/editarnoticias/:id", async (req, res) => {
	const noticia = await noticiasCollection.findById(req.params.id);
	if (!noticia) {
		return res.status(404).send("Noticia no encontrada");
	}

	res.render("editarnoticias", {
		noticia,
		mensaje: mensaje,
		msgestado: msgestado,
		msgestilo: msgestilo
	});
	msgestado = false;
});

app.post("/editarnoticias/:id", async (req, res) => {
	try {
		const {
			titulo,
			contenido,
			fechaPublicacion,
			autor,
			categoria,
			destacada,
			enlaces
		} = req.body;

		if (
			!titulo ||
			!contenido ||
			!fechaPublicacion ||
			!autor ||
			!categoria
		) {
			msgestado = true;
			msgestilo = false;
			mensaje = "Todos los campos son obligatorios.";
			return res.redirect("/editarnoticias/" + req.params.id);
		}

		const fechaPublicacionDate = new Date(fechaPublicacion);
		if (isNaN(fechaPublicacionDate)) {
			msgestado = true;
			msgestilo = false;
			mensaje = "La fecha de publicación debe ser válida.";
			return res.redirect("/editarnoticias/" + req.params.id);
		}

		const isDestacada = destacada === "on";

		await noticiasCollection.findByIdAndUpdate(req.params.id, {
			titulo,
			contenido,
			fechaPublicacion,
			autor,
			categoria,
			destacada: isDestacada,
			enlaces
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
	res.render("login", {
		mensaje: mensaje,
		msgestado: msgestado,
		msgestilo: msgestilo
	});
	msgestado = false;
});

app.post("/login", async (req, res) => {
	try {
		const eventos = await eventosCollection.find();
		const user = await usuariosCollection.findOne({
			correo: req.body.correo.trim()
		});

		if (!user) {
			msgestado = true;
			msgestilo = false;
			mensaje = "Los datos ingresados son incorrectos.";
			return res.redirect("/login");
		}

		const usuarioClave = user.clave;

		if (req.body.password === "") {
			msgestado = true;
			msgestilo = false;
			mensaje = "La contraseña no puede estar vacía.";
			return res.redirect("/login");
		}

		if (req.body.password !== usuarioClave) {
			msgestado = true;
			msgestilo = false;
			mensaje = "Los datos ingresados son incorrectos.";
			return res.redirect("/login");
		}

		res.render("inicioadmin", { eventos });
	} catch (err) {
		console.error("Error capturado:", err);
		msgestado = true;
		msgestilo = false;
		mensaje = "Ocurrió un error inesperado.";
		return res.redirect("/login");
	}
});

const port = 5000;
app.listen(port, () => {
	console.log(`El servidor está abierto en el puerto: ${port}`);
});
