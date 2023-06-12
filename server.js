const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(cors());

let currentOption = "default"; // Option is now a global variable

app.options("*", cors());

app.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-type"
  );

  let jsonData = req.body;

  console.log("Received POST request with body:");
  console.log(jsonData);

  if ("option" in jsonData) {
    currentOption = jsonData["option"];
    console.log(`Option updated to: ${currentOption}`);
  } else if (
    Array.isArray(jsonData) &&
    jsonData.length > 0 &&
    jsonData[0].data &&
    jsonData[0].data.idHex
  ) {
    processPostData(currentOption, jsonData[0].data.idHex);
  }

  res.send("Received POST data");
});

function processPostData(option, tagId) {
  let filename = `maestro_producto.txt`;

  // Check if the file exists and if not, create it
  fs.access(filename, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFileSync(filename, "", (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        console.log(`Error reading file '${filename}'`);
        console.error(err);
        return;
      }

      // Check if the idHex is already in the file
      if (!data.includes(tagId)) {
        let writeData = `${tagId},${option}\n`;

        fs.appendFile(filename, writeData, { flag: "a+" }, (err) => {
          if (err) {
            console.log(`Error writing to file '${filename}'`);
            console.error(err);
          } else {
            console.log(`Data added to file '${filename}': ${writeData}`);
          }
        });
      } else {
        console.log(
          `ID ${tagId} already exists in '${filename}', not adding again.`
        );
      }
    });
  });
}

// Verifica si el archivo 'default.txt' existe y si no, lo crea.
const defaultFile = "default.txt";
fs.access(defaultFile, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFileSync(defaultFile, "Archivo de la opción Caja\n", (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
});
app.get("/datos", (req, res) => {
  fs.readFile("maestro_producto.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    let lineas = data.split("\n");
    let result = lineas.map((linea) => {
      let partes = linea.split(",");
      return { id: partes[0], tipo: partes[1] };
    });

    let contadores = {
      cajas: 0,
      dollys: 0,
      rollers: 0,
    };
    result.forEach((item) => {
      if (item.tipo in contadores) {
        contadores[item.tipo]++;
      }
    });

    res.json({ data: result, contadores: contadores });
  });
});

const PORT = 6969;
app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
