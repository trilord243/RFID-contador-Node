const express = require("express");
const fs = require("fs");
const cors = require("cors");

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
  let filename = `${option}.txt`;

  // If file does not exist, create it
  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, "", (err) => {
      if (err) {
        console.log(`Error creating file '${filename}'`);
        console.error(err);
        return;
      }
    });
  }

  // Check if ID is already in file
  fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading file '${filename}'`);
      console.error(err);
      return;
    }

    // If ID is not in file, append it
    if (!data.includes(tagId)) {
      fs.appendFile(filename, `${tagId}\n`, { flag: "a+" }, (err) => {
        if (err) {
          console.log(`Error writing tag ID to file '${filename}': ${tagId}`);
          console.error(err);
        } else {
          console.log(`Tag ID added to file '${filename}': ${tagId}`);
        }
      });
    } else {
      console.log(`Tag ID already in file '${filename}': ${tagId}`);
    }
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

const PORT = 6969;
app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
