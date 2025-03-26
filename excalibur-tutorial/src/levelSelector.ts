import { Engine, Scene, vec } from "excalibur";
import { LevelIcon } from "./levelIcon";

export class LevelSelector extends Scene {
  override onInitialize(engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game
    let l1 = new LevelIcon(
      () => {
        engine.goToScene('level1');
      },
      vec(150, 150),
      "Level 1"
    );
    let l2 = new LevelIcon(
      () => {
        console.log("clicked level 2");
      },
      vec(250, 150),
      "Level 2"
    );
    this.add(l1);
    this.add(l2);
  }
}
