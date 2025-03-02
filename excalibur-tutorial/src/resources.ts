import { FactoryProps, TiledResource } from "@excaliburjs/plugin-tiled";
import { ImageSource, Loader, vec } from "excalibur";
import { Player } from "./player";

// It is convenient to put your resources in one place
export const Resources = {
  Sword: new ImageSource("./images/sword.png"), // Vite public/ directory serves the root images
  Knight: new ImageSource(
    "./assets/Factions/Knights/Troops/Warrior/Blue/Warrior_Blue.png"
  ),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources.
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}

export const TiledLevelMap = new TiledResource("./assets/level.tmx", {
  entityClassNameFactories: {
    Player: (props: FactoryProps) => {
      return new Player(vec(props.worldPos.x, props.worldPos.y));
    },
  },
});
loader.addResource(TiledLevelMap);
