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

function updateInventoryButtons() {
  fetch("http://localhost:6969/status")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("startInventoryBtn").disabled =
        data.processing || data.counting;
      document.getElementById("stopInventoryBtn").disabled =
        !data.processing || data.counting;
      document.getElementById("startBtn").disabled =
        data.counting || data.processing;
      document.getElementById("stopBtn").disabled =
        !data.counting || data.processing;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Llamar a la función updateInventoryButtons() al cargar la página
updateInventoryButtons();

document
  .getElementById("startInventoryBtn")
  .addEventListener("click", function () {
    fetch("http://localhost:6969/start", {
      method: "POST",
    }).then(() => {
      // Habilitar el botón "Detener Inventario" y deshabilitar el botón "Iniciar Inventario"
      document.getElementById("stopInventoryBtn").disabled = false;
      document.getElementById("startInventoryBtn").disabled = true;
      updateInventoryButtons();
    });
  });

document
  .getElementById("stopInventoryBtn")
  .addEventListener("click", function () {
    fetch("http://localhost:6969/stop", {
      method: "POST",
    }).then(() => {
      // Habilitar el botón "Iniciar Inventario" y deshabilitar el botón "Detener Inventario"
      document.getElementById("startInventoryBtn").disabled = false;
      document.getElementById("stopInventoryBtn").disabled = true;
      updateInventoryButtons();
    });
  });

var dolys = 0;
var rollers = 0;
var cajas = 0;
var counting = false;

function despachar() {
  document.getElementById("despacho").style.display = "block";
}

function startCounting() {
  counting = true;
  document.getElementById("startBtn").disabled = true;
  document.getElementById("stopBtn").disabled = false;
}

function stopCounting() {
  counting = false;
  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
}

function processProduct(productType) {
  if (!counting) return;
  switch (productType) {
    case "dolys":
      dolys++;
      document.getElementById("dolysCounter").innerText = dolys;
      break;
    case "rollers":
      rollers++;
      document.getElementById("rollersCounter").innerText = rollers;
      break;
    case "cajas":
      cajas++;
      document.getElementById("cajasCounter").innerText = cajas;
      break;
  }
}

function showInventory() {
  document.getElementById("inventory").style.display = "block";
  document.getElementById("despacho").style.display = "none";
  document.getElementById("contadores").style.display = "none";
}

function showDespacho() {
  document.getElementById("inventory").style.display = "none";
  document.getElementById("despacho").style.display = "block";
  document.getElementById("contadores").style.display = "none";
}

function showContadores() {
  document.getElementById("inventory").style.display = "none";
  document.getElementById("despacho").style.display = "none";
  document.getElementById("contadores").style.display = "block";
}
