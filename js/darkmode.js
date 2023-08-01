let body = document.body;
const botonDarkMode = document.querySelector("#botonDarkMode");
const botonLightMode = document.querySelector("#botonLightMode");
let darkmode = localStorage.getItem("dark-mode");

const activarDarkMode = () => {
    body.classList.add("darkMode"); 
    localStorage.setItem("dark-mode","activado");
    botonDarkMode.classList.add("disabled");
    botonLightMode.classList.remove("disabled");
}

const activarLightMode = () => {
    body.classList.remove("darkMode"); 
    localStorage.setItem("dark-mode", "desactivado" );
    botonDarkMode.classList.remove("disabled");
    botonLightMode.classList.add("disabled");
}


darkmode === "activado" ? activarDarkMode() : activarLightMode();

botonDarkMode.addEventListener("click", (e)=> {
    e.preventDefault();
    darkmode = localStorage.getItem("dark-mode");
    activarDarkMode()
})

botonLightMode.addEventListener("click", (e)=> {
    e.preventDefault();
    darkmode = localStorage.getItem("dark-mode");
    activarLightMode()
})