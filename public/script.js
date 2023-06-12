document.getElementById("dollys-button").addEventListener("click", function () {
  sendOption("dollys");
});

document
  .getElementById("rollers-button")
  .addEventListener("click", function () {
    sendOption("rollers");
  });

document.getElementById("cajas-button").addEventListener("click", function () {
  sendOption("cajas");
});

function sendOption(option) {
  fetch("http://localhost:6969", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ option: option }),
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
}

document
  .getElementById("mostrar-datos-button")
  .addEventListener("click", function () {
    fetch("http://localhost:6969/datos")
      .then((response) => response.json())
      .then((data) => {
        // Mostrar los datos
        let tabla = "<table><tr><th>ID</th><th>Tipo</th></tr>";
        data.data.forEach((item) => {
          tabla += `<tr><td>${item.id}</td><td>${item.tipo}</td></tr>`;
        });
        tabla += "</table>";
        document.getElementById("datos").innerHTML = tabla;

        // Mostrar los contadores
        let contadores =
          `Cajas: ${data.contadores.cajas}<br/>` +
          `Dollys: ${data.contadores.dollys}<br/>` +
          `Rollers: ${data.contadores.rollers}`;
        document.getElementById("contadores").innerHTML = contadores;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
