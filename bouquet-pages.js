// Handle buttons on default bouquet page (close button in common with game page)
const minimizeDefault = document.getElementById("minimize-def");
const minimizeBouquet = document.getElementById("minimize-bouquet");
const closeBtn = document.getElementById("close-game");

if (minimizeDefault) {
    minimizeDefault.addEventListener("click", () => {
        window.myApp.minimizeDefaultPage();
    })
}

if (minimizeBouquet) {
    minimizeBouquet.addEventListener("click", () => {
        window.myApp.minimizeBouquetPage();
    })
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        window.myApp.closeApp();
    });
}


document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch collected images asynchronously
        const collectedImages = await window.myApp.getCollected();

        if (!collectedImages || Object.values(collectedImages).flat().length === 0) {
            console.warn("No collected flowers found!");
            return;
        }

        const bouquetContainer = document.getElementById("bouquet-content");
        const basketBounds = { x: 200, y: 200, width: 260, height: 260 };

        let placedFlowers = [];
        let flowerIndex = 0;

        // Flatten the collected images object (since it’s stored by color)
        const allFlowers = Object.values(collectedImages).flat();

        // Function to place and animate flowers asynchronously
        async function placeFlower(flowerSrc) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const flowerImg = new Image();
                    flowerImg.src = flowerSrc;
                    flowerImg.classList.add("flower");

                    let newX, newY, tooClose, attempts = 0, maxAttempts = 20;
                    do {
                        newX = Math.random() * (basketBounds.width - 60) + basketBounds.x;
                        newY = Math.random() * (basketBounds.height - 60) + basketBounds.y;

                        tooClose = placedFlowers.some(flower =>
                            Math.hypot(flower.x - newX, flower.y - newY) < 40
                        );

                        attempts++;
                    } while (tooClose && attempts < maxAttempts);

                    placedFlowers.push({ x: newX, y: newY });

                    flowerImg.style.left = `${newX}px`;
                    flowerImg.style.top = `${newY}px`;
                    flowerImg.style.width = "100px";
                    flowerImg.style.setProperty('--rotation', `${Math.random() * 20 - 10}deg`);

                    // Make the flower draggable
                    makeDraggable(flowerImg, basketBounds);

                    bouquetContainer.appendChild(flowerImg);
                    resolve(); // Mark this flower as placed
                }, flowerIndex++ * 200); // Delay each flower's appearance
            });
        }

        // Place flowers one by one
        for (const flowerSrc of allFlowers) {
            await placeFlower(flowerSrc);
        }

    } catch (error) {
        console.error("Error loading collected flowers:", error);
    }
});

// Dragging function
function makeDraggable(flower, bounds) {
    let isDragging = false; // Track dragging state

    // Click on the flower to pick it up (toggle dragging)
    flower.addEventListener("click", (e) => {
        isDragging = !isDragging; // Toggle dragging state

        if (isDragging) {
            // Store initial offsets for smooth dragging
            flower.dataset.offsetX = e.clientX - flower.offsetLeft;
            flower.dataset.offsetY = e.clientY - flower.offsetTop;
            flower.style.cursor = "grabbing"; // Change cursor
        } else {
            flower.style.cursor = "grab"; // Restore cursor when dropped
        }
    });

    // Move the flower freely while dragging is active
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return; // Only move if dragging is active

        // Get stored offsets
        let offsetX = parseFloat(flower.dataset.offsetX);
        let offsetY = parseFloat(flower.dataset.offsetY);

        // Calculate new position
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Keep the flower inside the basket (apply boundary constraints)
        newX = Math.max(bounds.x, Math.min(bounds.x + bounds.width - flower.clientWidth, newX));
        newY = Math.max(bounds.y, Math.min(bounds.y + bounds.height - flower.clientHeight, newY));

        // Move the flower
        flower.style.left = `${newX}px`;
        flower.style.top = `${newY}px`;
    });
}

