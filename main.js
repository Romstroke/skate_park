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
const { dirname } = require('path');

//levantar servidor
app.listen(3000, () => {
    console.log('Servidor Express iniciado en el puerto 3000');
});
//carpeta public
app.use(express.static(__dirname + "/public"));

app.set('view engine', 'handlebars');

//sirviendo html sin handlebars 
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')
});

//plataforma web en la que los participantes se podrán registrar y revisar el estado de su solicitud 

// 1. Crear una API REST con el Framework Express (3 Puntos)  
// 2. Servir contenido dinámico con express-handlebars (3 Puntos)
// 3. Ofrecer la funcionalidad Upload File con express-fileupload (2 Puntos) 
// 4. Implementar seguridad y restricción de recursos o contenido con JWT (2 Puntos)  