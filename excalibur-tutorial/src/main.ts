import { DisplayMode, Engine } from "excalibur";
import { Level1Map, loader } from "./resources";

import { LevelSelector } from "./levelSelector";
import { Level } from "./level";

// Goal is to keep main.ts small and just enough to configure the engine
const game = new Engine({
  width: 800, // Logical width and height in game pixels
  height: 600,
  displayMode: DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    levelSelector: LevelSelector,
    level1: new Level("Level 1", Level1Map),
  },
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game.start("levelSelector", {
  loader,
});
