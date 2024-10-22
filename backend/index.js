const express = require("express");
const cors = require("cors")
const mysql = require("mysql");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "escorts",
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/usuarios", (req, res) => {
    const query = "SELECT * FROM usuarios";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post("/usuarios", (req, res) => {
    const { nombre, edad, celular, pais, email, password_hash } = req.body
    const query = "INSERT INTO usuarios (nombre, edad, celular, pais, email, password_hash, imagenes) VALUES (?,?,?,?,?,?)"
    
    db.query(query, [nombre, edad, celular, pais, email, password_hash, imagenes], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).json({message: "Usuario creado con éxito"})
    });
});

app.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, edad, celular, pais, email, password_hash } = req.body; 
    const query = "UPDATE usuarios SET nombre = ?, edad = ?, celular = ?, pais = ?, email = ?, password_hash = ? WHERE id = ?";
    db.query(query, [nombre, edad, celular, pais, email, password_hash, id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.json({ id, nombre, edad, celular, pais, email, password_hash});
    });
});

app.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params; 
    const query = "DELETE FROM usuarios WHERE id = ?"
    
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err); 
        }
        if (results.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado"); 
        }
        res.status(204).send();
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
