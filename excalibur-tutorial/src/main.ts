import { Color, DisplayMode, Engine, FadeInOut, vec } from "excalibur";
import { loader, TiledLevelMap } from "./resources";
import { Level1 } from "./level";
import { Level2 } from "./level2";
import { Player } from "./player";
import { Level3 } from "./level3";
import { TiledLevel } from "./tiledLevel";

// Goal is to keep main.ts small and just enough to configure the engine

let player = new Player(vec(100, 250));

const game = new Engine({
  width: 800, // Logical width and height in game pixels
  height: 600,
  displayMode: DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    level1: new Level1(player),
    level2: new Level2(player),
    level3: new Level3(player),
    tiledLevel: TiledLevel,
  },
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game
  .start("tiledLevel", {
    loader,
  })
  .then(() => {
    TiledLevelMap.addToScene(game.currentScene);
    // Do something after the game starts
  });
