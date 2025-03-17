// Debugging: Check if `window.myApp` is accessible
console.log("window.myApp:", window.myApp);


// Handle custom control buttons for game page
const closeBtn = document.getElementById("close-game");
const minimizeBtn = document.getElementById("minimize-game");
const easterEgg = document.getElementById("easter-egg");

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        window.myApp.closeApp();
    });
}

if (minimizeBtn) {
    minimizeBtn.addEventListener("click", () => {
        window.myApp.minimizeGame();
    });
}

// Check if we are on the game page (where the pause button exists)
if (document.getElementById("pause-btn")) {
    document.getElementById("pause-btn").addEventListener("click", function() {
        const pauseText = document.getElementById("pause-text");

        if (isGamePaused) {
            resumeGame();
            pauseText.textContent = "Pausa";
        } else {
            pauseGame();
            pauseText.textContent = "Riprendi";
        }
    });
}

if (easterEgg) {
    easterEgg.addEventListener("click", () => {
        if (!isGamePaused) pauseGame();
        const pauseText = document.getElementById("pause-text");
        pauseText.textContent = "Riprendi";
        window.myApp.openEasterEggWindow();
    });
}

window.electron.on("resume-game", () => {
    resumeGame();
    const pauseText = document.getElementById("pause-text");
    pauseText.textContent = "Pausa"
});


// GAME LOGIC: Variables for game state
let fallingImages = [];
let basket = { x: 300, y: 625, width: 120, height: 75 }; // Basket position and size
let collectedItems = { red: 0, yellow: 0, blue: 0, purple: 0 }; // Tracks collected images
let collectedImages = { red: [], yellow: [], blue: [], purple: [] }; // Stores collected flower images
let selectedItems = {}; // Stores user selections from the previous page
let isGameOver = false;
let timer = 180; // 3 minutes in seconds

let gameLoopId; // Store the game loop ID for requestAnimationFrame
let timerIntervalId; // Store the timer interval ID for setInterval
let isGamePaused = false; // Flag to track the game's pause state

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

// Ensure the canvas is found before proceeding
if (!canvas || !ctx) {
    console.error("Canvas not found or failed to initialize!");
}

// Load basket image and wait for it to load before starting the game
const basketImg = new Image();
basketImg.src = "assets/Vase.PNG"; // Ensure this path is correct
basketImg.onload = () => {
    console.log("Basket image loaded!");
    startGame(); // Start game only after basket image is loaded
};

// Load falling images
const images = {
  red: [
    "assets/Poppy tall frontal red.PNG",
    "assets/Poppy tall lateral red.PNG",
    "assets/Poppy wide frontal red.PNG",
    "assets/Poppy frontal red.PNG",
    "assets/Poppy lateral big red.PNG",
    "assets/Poppy lateral small red.PNG",
  ],
  yellow: [
    "assets/Poppy tall frontal yellow.PNG",
    "assets/Poppy tall lateral yellow.PNG",
    "assets/Poppy wide frontal yellow.PNG",
    "assets/Poppy frontal yellow.PNG",
    "assets/Poppy lateral big yellow.PNG",
    "assets/Poppy lateral small yellow.PNG",
  ],
  blue: [
    "assets/Poppy tall frontal blue.PNG",
    "assets/Poppy tall lateral blue.PNG",
    "assets/Poppy wide frontal blue.PNG",
    "assets/Poppy frontal blue.PNG",
    "assets/Poppy lateral big blue.PNG",
    "assets/Poppy lateral small blue.PNG",
  ],
  purple: [
    "assets/Poppy tall frontal purple.PNG",
    "assets/Poppy tall lateral purple.PNG",
    "assets/Poppy wide frontal purple.PNG",
    "assets/Poppy frontal purple.PNG",
    "assets/Poppy lateral big purple.PNG",
    "assets/Poppy lateral small purple.PNG",
  ],
};

// Listen for the game initialization event
window.myApp.initializeGame((data) => {
    // If the data is undefined, it means the data is not being sent correctly
    if (!data || !data.selections) {
        console.error("Invalid game data received", data);
        return;
    }

    // Set selected items from the renderer
    selectedItems = data.selections;

    // Set the counters based on selected items
    updateColorCounters();
});

// Color counters update
function updateColorCounters() {
    console.log("Updating counters:", selectedItems, collectedItems);

    document.getElementById("counter-red").textContent = `Rosso: ${selectedItems.red - collectedItems.red}`;
    document.getElementById("counter-yellow").textContent = `Giallo: ${selectedItems.yellow - collectedItems.yellow}`;
    document.getElementById("counter-blue").textContent = `Blu: ${selectedItems.blue - collectedItems.blue}`;
    document.getElementById("counter-purple").textContent = `Viola: ${selectedItems.purple - collectedItems.purple}`;
}

let gameStarted = false; // Prevent multiple starts

// Starts the game loop
function startGame() {
    if (gameStarted) return; 
    gameStarted = true;

    console.log("Game started!");
    timerIntervalId = setInterval(updateTimer, 1000); // Decrease timer every second
    scheduleNextSpawn(); // Start spawning images with random delays
    requestAnimationFrame(updateGame); // Start game loop
}

// Function to pause the game
function pauseGame() {
    if (isGamePaused) return; // If already paused, do nothing

    isGamePaused = true; // Set the game state to paused
    clearInterval(timerIntervalId); // Stop the timer
    cancelAnimationFrame(gameLoopId); // Stop the game loop
    stopSpawning();
    console.log("Game paused!");
}

// Function to resume the game
function resumeGame() {
    if (!isGamePaused) return; // If not paused, do nothing

    isGamePaused = false; // Set the game state to resumed
    timerIntervalId = setInterval(updateTimer, 1000); // Restart the timer
    requestAnimationFrame(updateGame); // Restart the game loop
    resumeSpawning();
    console.log("Game resumed!");
}

let spawnTimeout; // Store the timeout reference

// Function to schedule the next spawn with a random delay
function scheduleNextSpawn() {
    if (isGameOver || isGamePaused) return; // Stop scheduling if game is paused or over

    const delay = Math.random() * 1500 + 1800; // Random delay between 1.8s and 3.3s
    spawnTimeout = setTimeout(() => {
        spawnImage();
        scheduleNextSpawn(); // Only schedule the next spawn if not paused
    }, delay);
}

// Timer update
function updateTimer() {
    if (!isGameOver) {
        timer--;
        if (timer <= 0) {
            gameOver('lose-time');
        }
        updateTimerDisplay();
    }
}

// Update the timer display in HTML
function updateTimerDisplay() {
    const timerElement = document.getElementById("time-left");
    if (timerElement) {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
}

// Spawn a new random image
function spawnImage() {
    if (isGameOver || isGamePaused) return; // Prevent spawning when paused
  
    const colors = Object.keys(images);
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomImageSrc = images[randomColor][Math.floor(Math.random() * images[randomColor].length)];
  
    const img = new Image();

    img.onload = () => {
        console.log(`Loaded image: ${img.src}`);

        // Get correct size only after the image has loaded
        const { width, height } = getImageSize(img);

        const padding = width / 2; // Ensure the whole image is visible
        
        // Ensure the whole image is within the canvas
        const minX = 0; // Leftmost possible position
        const maxX = canvas.width - width; // Rightmost possible position

        let newX;
        let tooClose;

        do {
            newX = Math.random() * (maxX - minX) + minX; // Ensures full image fits
            tooClose = fallingImages.some(flower => Math.abs(flower.x - newX) < 80);
        } while (tooClose);

        fallingImages.push({
            x: newX,
            y: 0,
            image: img, // Store the actual Image object
            color: randomColor,
            width,
            height
        });

        console.log(`Spawned image with size: ${width}x${height}`);
    };

    img.src = randomImageSrc; 
}  

// Stop spawning by clearing the scheduled timeout
function stopSpawning() {
    clearTimeout(spawnTimeout);
}

// Resume spawning if the game is not over
function resumeSpawning() {
    if (!isGamePaused && !isGameOver) {
        scheduleNextSpawn(); // Restart the spawning loop
    }
}

// Define the sizes for different types of images
const imageSizes = {
    square: { width: 75, height: 70 },   // 1 almost square (poppy frontal)
    tall: { width: 66, height: 80 },     // 2 tall rectangles (poppy tall frontal, poppy tall lateral)
    wide: { width: 84, height: 60 },     // 1 wide rectangles (poppy 3 frontal)
    wider: {width: 88, height: 50}       // 2 wider rectangles (poppy lateral big, poppy lateral small)
};

// Function to determine image type based on its name or another identifier
function getImageSize(image) {
    console.log(`Determining size for image: ${image.src}`);

    if (image.src.includes("tall")) {
        console.log("Assigned size: Tall (66x80)");
        return imageSizes.tall;
    }
    if (image.src.includes("wide")) {
        console.log("Assigned size: Wide (84x60)");
        return imageSizes.wide;
    }
    if ((image.src.includes("lateral") && image.src.includes("big")) ||
        (image.src.includes("lateral") && image.src.includes("small"))) {
        console.log("Assigned size: Wider (88x50)");
        return imageSizes.wider;
    }

    console.log("Assigned size: Default Square (75x70)");
    return imageSizes.square;
}

// Update game state
function updateGame() {
    if (isGamePaused || isGameOver) return; // Stop the game loop if paused or over

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw falling images
    for (let i = 0; i < fallingImages.length; i++) {
        const { x, y, image, color, width, height } = fallingImages[i];

        ctx.drawImage(image, x, y, width, height);
        fallingImages[i].y += 1.2; // Move image downward

        // Check for collision with basket
        if (
            y + height - 20 >= basket.y &&
            x + width - 20 >= basket.x &&
            x <= basket.x + basket.width
        ) {
            collectImage(color, image.src);
            fallingImages.splice(i, 1);
            i--;
        } else if (y > canvas.height) {
            fallingImages.splice(i, 1); // Remove images that fall off-screen
            i--;
        }
    }

    // Draw basket
    ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);

    gameLoopId = requestAnimationFrame(updateGame);
}

// Handle collecting an image
function collectImage(color, imageSrc) {
    if (selectedItems[color] > 0 && collectedItems[color] < selectedItems[color]) {
        collectedItems[color]++;

        collectedImages[color].push(imageSrc); // Store the image source
        // Check if source collection works
        console.log(`${imageSrc} collected`)

        updateColorCounters(); // Update the counter display

        if (checkWinCondition()) {
            gameOver('win');
        }
    } else {
       gameOver('lose-wrong-flower');
    }
}  

// Check if all required items are collected
function checkWinCondition() {
    return Object.entries(selectedItems).every(
        ([color, count]) => (collectedItems[color] || 0) >= count
    );
}

// Handle game over
function gameOver(result) {
    isGameOver = true;

    if (result === 'win') {
        console.log("Game won!")
        window.myApp.openWinModal();
        window.myApp.setCollected(collectedImages); // Send collected images to main process
    } else if (result === 'lose-time') {
        console.log("Game over! Time's up!")
        window.myApp.openLoseTimeModal();
    } else if (result === 'lose-wrong-flower') {
        console.log("Game over! Wrong flower!")
        window.myApp.openLoseWrongFlowerModal();
    }
}

// Move basket with arrow keys
window.addEventListener("keydown", (event) => {
    const moveSpeed = 12; // Increase movement speed

    if (event.key === "ArrowLeft" && basket.x > 0) {
        basket.x -= moveSpeed;
    }
    if (event.key === "ArrowRight" && basket.x < canvas.width - basket.width) {
        basket.x += moveSpeed;
    }
});
