const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gym',
    password: '1234',
    port: 5432
});

// Funcion para insertar registros en la tabla Ejercicios

async function agregar (nombre, series, repeticiones, descanso) {
    console.log("Valores recibidos: " , nombre, series, repeticiones, descanso);
    const result = await pool.query({ 
        text: 'INSERT INTO ejercicios (nombre, series, repeticiones, descanso) VALUES ($1, $2, $3, $4) RETURNING *',
        values: [nombre, series, repeticiones, descanso]
    })
    console.log("Registro agregado: " , result.rows[0]);
    //Respuesta de la funcion
    return result.rows[0];
    // return "Registro agregado con exito"
};
// agregar("flexiones de codo", "40", "20", "15");

async function todos () {
    const result = await pool.query("SELECT * FROM skaters");
    return result.rows;
}

//funcion para eliminar un registro según su nombre recibido como un query.string
async function eliminar (nombre) {
    const result = await pool.query("DELETE FROM ejercicios WHERE nombre = $1 RETURNING *", [nombre]);
    return result.rows[0];
}

//funcion para editar un registro
async function editar (nombre, series, repeticiones, descanso) {
    const result = await pool.query("UPDATE ejercicios SET series = $1, repeticiones = $2, descanso = $3 WHERE nombre = $4 RETURNING *", [series, repeticiones, descanso, nombre]);
    return result.rows[0];
}

//funcion consultar x nombre
async function consultaNombre (nombre) {
    const result = await pool.query("SELECT * FROM ejercicios WHERE nombre = $1 RETURNING *", [nombre]);
    return result.rows[0];
}

module.exports = {agregar, todos, eliminar, editar, consultaNombre};