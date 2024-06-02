// - PostgreSQL (pg)
const { Pool } = require("pg");

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'skatepark',
    password: '1234',
    port: 5432
});

//obtener skaters
  // let skaters = [];
  async function obtenerSkaters() {
    const result = await pool.query("SELECT * FROM skaters");
    // console.log(result);
    return result.rows;
}


//login skater
// CONSULTA A LA BASE DE DATOS PARA SABER SI ES QUE EL USUARIO EXISTE 
async function consultaSkater(email,password) {
    const result = await pool.query("SELECT * FROM skaters WHERE email = $1 AND password = $2", [email,password]); //aqui no se usa el returning, porque el select retorna, solo se usa cuando inserto o modifico algo
    // console.log(result);
    return result.rows[0];
} // esto no es una void pq tiene return 

//post skater
async function agregarSkater(email, nombre, password, anos_experiencia, especialidad, pathPhoto) {
    // console.log("Valores recibidos: ", email, nombre, password, anos_experiencia, especialidad, pathPhoto);
    const result = await pool.query({
        text: 'INSERT INTO skaters (email,nombre,password,anos_experiencia,especialidad,foto,estado) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *',
        values: [email, nombre, password, anos_experiencia, especialidad, pathPhoto, false]
    })
    console.log("Registro agregado: ", result.rows[0]);
    //Respuesta de la funcion
    return result.rows[0];
    // return "Registro agregado con exito"
};

//put skater
async function editar(id,nombre,anos_experiencia,especialidad) {
    const result = await pool.query("UPDATE skaters SET nombre = $2, anos_experiencia = $3, especialidad = $4 WHERE id = $1 RETURNING *", [id,nombre,anos_experiencia,especialidad]);
    return result.rows[0];
}

//editar skater status
async function editarStatus(id,estado) {
    const result = await pool.query("UPDATE skaters SET estado = $1 WHERE id = $2 RETURNING *", [estado,id]);
    return result.rows[0];
}

//delete skater
async function eliminar(id) {
    const result = await pool.query("DELETE FROM skaters WHERE id = $1 RETURNING *", [id]);
    // const skaterEliminado = result.rows[0];
    // return skaterEliminado;
    return result.rows[0];
}

module.exports = {obtenerSkaters,consultaSkater,agregarSkater,editar,editarStatus,eliminar};