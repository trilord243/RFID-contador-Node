const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

let app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let correspondencias = {};
let contadores = {
  dollys: 0,
  cajas: 0,
  rollers: 0,
};
let tagsVistos = [];
let countingStarted = false; // Nuevo estado para verificar si la cuenta ha comenzado

fs.readFile("maestro_producto.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let lineas = data.split("\n");
  lineas.forEach((linea) => {
    let partes = linea.split(",");
    if (partes.length >= 2) {
      correspondencias[partes[0].trim()] = partes[1].trim();
    }
  });
});

app.post("/inicializar", (req, res) => {
  console.log("Inicializando contadores y registro de tags...");
  contadores = {
    dollys: 0,
    cajas: 0,
    rollers: 0,
  };
  tagsVistos = [];
  countingStarted = true; // Indica que la cuenta ha comenzado
  res.send("Contadores y registro de tags inicializados.");
});

app.post("/", (req, res) => {
  let data = req.body;
  let tag = data[0].data.idHex;
  console.log(`Recibido tag: ${tag}`);

  if (countingStarted) {
    // Comenzar a contar sólo si countingStarted es true
    if (tagsVistos.includes(tag)) {
      console.log("Tag repetido, ignorando...");
    } else {
      tagsVistos.push(tag);
      let nombre = correspondencias[tag] || "desconocido";
      if (["dollys", "cajas", "rollers"].includes(nombre)) {
        contadores[nombre]++;
        console.log(
          `Contador de ${nombre} incrementado a ${contadores[nombre]}`
        );
      }
    }
  } else {
    console.log("La cuenta aún no ha comenzado. Ignorando tag.");
  }

  res.send(`Recibido tag: ${tag}`);
});

app.get("/contadores", (req, res) => {
  res.json(contadores);
});

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
