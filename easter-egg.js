// Handle buttons on the Easter Egg window
const closeEaster = document.getElementById("close-easter");
const secretTrigger = document.getElementById("secret-trigger");

if (closeEaster) {
    closeEaster.addEventListener("click", () => {
        window.myApp.closeEasterEggWindow();  // Close window
        window.myApp.resumeGame();  // Resume game
    });
}

if (secretTrigger) {
    secretTrigger.addEventListener("click", () => {
        window.myApp.navigateToDefaultBouquet();
    })
}