import { TiledResource } from "@excaliburjs/plugin-tiled";
import { Scene, SceneActivationContext } from "excalibur";

export class Level extends Scene {
  name: string;
  map: TiledResource;
  constructor(name: string, map: TiledResource) {
    super();
    this.name = name;
    this.map = map;
  }

  onActivate(context: SceneActivationContext<unknown>): void {
    this.map.addToScene(this);
  }
}
