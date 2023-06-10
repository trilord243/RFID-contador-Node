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
