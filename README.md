# Valentine's Poppy Game 💖🌸

This repository contains a cute and fun web app built with Electron.js, featuring colorful pixel-art poppies and an engaging gameplay mechanic. Players must collect the right flowers to create a custom bouquet, with smooth animations and an interactive final touch. Simple, charming, and perfect for a little challenge!

## About the Game

I came up with the idea for this web app because I had the unfortunate realization that my boyfriend’s favorite flowers — poppies — don’t bloom in February. And since skipping a Valentine’s bouquet wasn’t an option, I had to find my own way to work around the problem.

With this game, he can play his way to a very special poppy bouquet! 💐

### How It Works

The player selects up to 10 colors in any combination. Their goal is to collect poppies in the exact colors and numbers they chose. If they succeed, they’ll earn a beautiful virtual bouquet! But be careful, as there's a timer — if it runs out, the game is over! Other than fun animations, the game features cute hand-drawn pixel art items, which I personally designed. Look closely — there might be a tiny hidden surprise! 

## Project Structure & How to Run It

This is a web app built with Electron.js, using:

- **HTML** for page layout 
- **CSS** for styling 
- **JavaScript** for scripting
  
Each page/window has its own .html file.

Electron allows you to create desktop applications using web technologies (HTML, CSS, JS). It runs a main process (Node.js backend) and renderer processes (browser windows).

The main process (**main.js**) manages window creation and communication between different pages, while the preload script (**preload.js**) acts as a bridge, ensuring safe communication between the renderer and main process.

### Steps to Set Up & Run the Game

1. Install Electron

If you haven’t installed Electron yet, do this first:

```
npm install -g electron
```

2. Clone the Repository

```
git clone https://github.com/ashley-andrea/valentine-game.git
cd valentine-game
```

3. Install dependencies

```
npm install
```

4. Start the Game
   
```
npm start
```

💡 By default, Electron names the main process file **index.js**, but I renamed it to main.js. If you prefer, you can **change the "main" field in package.json** back to index.js.

## ❤️ Special Note

This game is a labor of love and a special gift. I hope you enjoy playing it as much as I enjoyed creating it! 

Happy playing! ;)
