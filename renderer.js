console.log("Renderer script is loaded!");

let selections = {}; // Object to track selections by color
let totalSelections = 0; // Track total selected elements
const maxSelections = 10;

document.addEventListener('DOMContentLoaded', () => {
    if (!window.myApp) {
        console.error("window.myApp is not defined!");
        return;
    }

    // Handle "Minimize" and "Close" buttons
    const closeBtn = document.getElementById("close-btn");
    const minimizeBtn = document.getElementById("minimize-btn");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            window.myApp.closeApp();
        });
    }

    if (minimizeBtn) {
        minimizeBtn.addEventListener("click", () => {
            window.myApp.minimizeApp();
        });
    }

    // Handle "Start" button on the first page
    const startWrapper = document.getElementById("start-wrapper");

    if (startWrapper) {
        startWrapper.addEventListener("click", () => {
            window.myApp.navigateToSecondPage();
        });
    }

    // Handle color selection on the second page
    const imageBoxes = document.querySelectorAll('.image-box');
    const buttonWrapper = document.querySelector('.button-wrapper');
    const doneButton = document.getElementById('done-button');

    // Get the counter elements
    const redCountEl = document.getElementById("red-count");
    const yellowCountEl = document.getElementById("yellow-count");
    const blueCountEl = document.getElementById("blue-count");
    const purpleCountEl = document.getElementById("purple-count");

    function updateColorDisplay() {
        redCountEl.textContent = selections.red || 0;
        yellowCountEl.textContent = selections.yellow || 0;
        blueCountEl.textContent = selections.blue || 0;
        purpleCountEl.textContent = selections.purple || 0;
    }
    
    let selectionMade = false;
    
    imageBoxes.forEach(box => {
        box.addEventListener('click', () => {
            if (!selectionMade) {
                selectionMade = true;
                buttonWrapper.classList.remove('disabled');
                doneButton.style.opacity = '1';
                doneButton.style.pointerEvents = 'auto';
            }
        });
    });    

    if (imageBoxes.length > 0 && doneButton) {
        imageBoxes.forEach((box) => {
            const color = box.dataset.color;
            selections[color] = 0;

            box.addEventListener('click', () => {
                if (totalSelections < maxSelections) {
                    selections[color]++;
                    totalSelections++;

                    // Update the count text dynamically
                    updateColorDisplay();

                    // Update the count text
                    const countText = box.querySelector('.count-text');
                    countText.textContent = `x ${selections[color]}`;
                    countText.style.opacity = 1;

                    // Fade out count after 1 second
                    setTimeout(() => {
                        countText.style.opacity = 0;
                    }, 1000);

                    // Enable "Done" button if at least one selection is made
                    if (totalSelections > 0) {
                        doneButton.disabled = false;
                    }
                }
            });
        });

        // Handle "Done" button click
        if (doneButton) {
            doneButton.addEventListener('click', () => {
                if (window.myApp && typeof window.myApp.setSelections === "function") {
                    // Now it should be safe to call setSelections
                    window.myApp.setSelections(selections);  // Call setSelections to send data to game.js
                    window.myApp.openConfirmationWindow();
                } else {
                    console.error("setSelections is not defined or window.myApp is not available.");
                }
            });
        }
    }

    // Handle "Reset" button
    const resetWrapper = document.querySelector('.reset-wrapper')
    const resetButton = document.getElementById('reset-button');

    // Function to reset selections
    function resetSelections() {
        console.log("Reset button clicked!"); // Debugging message to verify function call

        // Reset internal selections object
        selections = {
            red: 0,
            yellow: 0,
            blue: 0,
            purple: 0
        };

        // Reset displayed counts
        totalSelections = 0;
        updateColorDisplay(); // Ensure displayed values match the reset state

        // Reset count text overlays on images
        imageBoxes.forEach(box => {
            const countText = box.querySelector('.count-text');
            if (countText) {
                countText.textContent = "";
                countText.style.opacity = 0;
            }
        });

        // Disable both Reset and Done button wrappers after reset
        resetWrapper.classList.add('disabled');
        buttonWrapper.classList.add('disabled');
        resetButton.disabled = true;
        doneButton.disabled = true;
    }

    // Enable Reset Button only when a selection is made
    imageBoxes.forEach(box => {
        box.addEventListener('click', () => {
            if (totalSelections > 0) {
                resetWrapper.classList.remove('disabled'); // Enable Reset
                resetButton.disabled = false;
                buttonWrapper.classList.remove('disabled');
                doneButton.style.opacity = '1';
                doneButton.style.pointerEvents = 'auto';
            }
        });
    });

    if (resetButton) {
        resetButton.style.pointerEvents = 'auto';
        resetButton.addEventListener('click', () => {
            resetSelections();
        });
    } else {
        console.error("Reset button not found!");
    }

    // Handle buttons on the confirmation window
    const closeWindow = document.getElementById("close-window");
    const confirmWrapper = document.getElementById("confirm-wrapper");

    if (closeWindow) {
        closeWindow.addEventListener("click", () => {
            window.myApp.closeConfirmationWindow();
        })
    }

    if (confirmWrapper) {
        confirmWrapper.addEventListener("click", () => {
            window.myApp.navigateToGame();
        });
    }
});