import { FactoryProps, TiledResource } from "@excaliburjs/plugin-tiled";
import { ImageSource, Loader, vec, EventEmitter } from "excalibur";
import { Player } from "./player";
import { Goblin } from "./goblin";

const eventEmitter = new EventEmitter();

// It is convenient to put your resources in one place
export const Resources = {
  Sword: new ImageSource("./images/sword.png"), // Vite public/ directory serves the root images
  Knight: new ImageSource(
    "./assets/Factions/Knights/Troops/Warrior/Blue/Warrior_Blue.png"
  ),
  Goblin: new ImageSource(
    "./assets/Factions/Goblins/Troops/Torch/Blue/Torch_Blue.png"
  ),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources.
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}

export const Level1Map = new TiledResource("./assets/level1.tmx", {
  useMapBackgroundColor: true,
  entityClassNameFactories: {
    Player: (props: FactoryProps) => {
      return new Player(vec(props.worldPos.x, props.worldPos.y), eventEmitter);
    },
    Goblin: (props: FactoryProps) => {
      return new Goblin(vec(props.worldPos.x, props.worldPos.y), eventEmitter);
    },
  },
});
loader.addResource(Level1Map);
