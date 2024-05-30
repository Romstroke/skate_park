//Importando funcion desde el modulo consultas.js
const { agregar, todos, eliminar, editar,consultaNombre } = require('./consultas/consultas.js');

//DEPENDENCIAS
// Express
const express = require('express');
const app = express();
// - Handlebars --> mercado web (modulo 6 dia 6)
const exphbs = require('express-handlebars');
// - PostgreSQL (pg)
const { Pool } = require("pg");
// - JWT --> en el del alien (fbi modulo 8 dia 8)
const jwt = require('jsonwebtoken');
// - Express-fileupload --> en collage imagenes (modulo 8 dia 4)
const expressFileUpload = require("express-fileupload");
// const { dirname } = require('path');

//levantar servidor
app.listen(3000, () => {
    console.log('Servidor Express iniciado en el puerto 3000');
});
//carpeta public
app.use(express.static(__dirname + "/public"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))


//
app.set('view engine', 'handlebars');
// app.set('views', '/views/componentes');

app.engine('handlebars', exphbs.engine({
    extname: '.handlebars', // Extensiones de los archivos de plantillas
    defaultLayout: 'main', // Plantilla principal
    layoutsDir: __dirname + '/views', // Directorio de las plantillas principales
    partialsDir: __dirname + '/views/componentes' // Directorio de los partials
}));

app.get("/", async (req, res) => { //ruta raiz
    res.render("Home");
});

app.get("/login", async (req, res) => { 
    res.render("Login");
});

app.get("/registro", (req, res) => {
    res.render("Registro");
});

app.get("/perfil", (req, res) => {
    const { token } = req.query
    jwt.verify(token, secretKey, (err, skater) => {
        if (err) {
            res.status(500).send({
                error: `Algo salió mal...`,
                message: err.message,
                code: 500
            })
        } else {
            res.render("Perfil", { skater });
        }
    })
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const skater = skaters.find((s) => s.email == email && 
                                         s.password == password);
        
        const token = jwt.sign(skater, secretKey)
        res.status(200).send(token)

    } catch (e) {

        console.log(e)
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
        
    };
});

app.get("/Admin", async (req, res) => {
    try {
        res.render("Admin");
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

// //sirviendo html sin handlebars
// app.get('/index', (req,res) => {
//     res.sendFile(__dirname + '/index.html') //vista HOME, lo primero que vemos al levantar la app
// });

//plataforma web en la que los participantes se podrán registrar y revisar el estado de su solicitud

// 1. Crear una API REST con el Framework Express (3 Puntos)
// 2. Servir contenido dinámico con express-handlebars (3 Puntos)
// 3. Ofrecer la funcionalidad Upload File con express-fileupload (2 Puntos)
// 4. Implementar seguridad y restricción de recursos o contenido con JWT (2 Puntos)  

// API REST de Skaters

app.get("/skaters", async (req, res) => {

    try {
        res.status(200).send(skaters);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.post("/skaters", async (req, res) => {
    const skater = req.body;
    console.log('squeiter', skater);
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send("No se encontro ningun archivo en la consulta");
    }
    const { files } = req
    const { foto } = files;
    const { name } = foto;
    const pathPhoto = `/uploads/${name}`

    console.log("Valor del req.body: ", skater);
    console.log("Nombre de imagen: ", name);
    console.log("Ruta donde subir la imagen: ", pathPhoto);


    foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
        try {
            if (err) throw err
            skater.foto = pathPhoto
            skaters.push(skater);
            res.status(201).redirect("/");
        } catch (e) {
            console.log(e)
            res.status(500).send({
                error: `Algo salió mal... ${e}`,
                code: 500
            })
        };

    });
})

app.put("/skaters", async (req, res) => {
    const {id, nombre,anos_experiencia, especialidad} = req.body;
    console.log("Valor del body: ", id, nombre,anos_experiencia, especialidad);
    try {
        const skaterB = skaters.findIndex((s) => s.id == id);
//        if (skaterB) {
           skaters[skaterB].nombre = nombre;
           skaters[skaterB].anos_experiencia =anos_experiencia;
           skaters[skaterB].especialidad = especialidad;
            res.status(200).send("Datos actualizados con éxito");
        // } else {
        //     res.status(400).send("No existe este Skater");
        // }
        
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.put("/skaters/status/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    console.log("Valor de estado recibido por body: ",estado)
    try {
         const skaterB = skaters.findIndex((s) => s.id == id);

        //if (skaterB !== -1) {
            skaters[skaterB].estado = estado;
            res.status(200).send("Estado Actualizado con éxito");
        // } else {
        //     res.status(400).send("No existe este Skater");
        // }

    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

app.delete("/skaters/:id", async (req, res) => {
    const { id } = req.params
    try {
        const skaterB = skaters.findIndex((s) => s.id == id);

        if (skaterB !==-1) {
            skaters.splice(skaterB, 1);
            res.status(200).send("Skater Eliminado con éxito");
        } else {
            res.status(400).send("No existe este Skater");
        }

    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});
