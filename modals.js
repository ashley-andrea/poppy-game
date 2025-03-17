// Handle continue button on win page
const continueContainer = document.getElementById("continue-container");

if (continueContainer) {
    continueContainer.addEventListener("click", () => {
        window.myApp.openBouquetPage();
    });
}

// Handle reset and restart buttons in lose pages
const retryContainer = document.getElementById("retry-container");
const resetContainer = document.getElementById("reset-container");

document.getElementById("retry-container").addEventListener("click", () => {
    window.myApp.navigateToGame();
});

document.getElementById("reset-container").addEventListener("click", () => {
    window.myApp.navigateToSecondPage(); // Bring user back to the selection page
});
