import {
  Color,
  DefaultLoader,
  Engine,
  Font,
  FontUnit,
  Label,
  Scene,
  vec,
} from "excalibur";
import { Player } from "./player";
import { Square } from "./square";
import { playerClamp } from "./util";
import { LevelSelector } from "./levelSelector";

export class Level1 extends Scene {
  player: Player;
  constructor(p: Player) {
    super();
    this.player = p;
  }

  override onInitialize(engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game

    const title = new Label({
      text: "LEVEL 1",
      pos: vec(300, 100),
      font: new Font({
        family: "impact",
        size: 48,
        unit: FontUnit.Px,
      }),
    });

    this.add(title);
    // this.add(new Square(vec(0, 0), Color.Red));
    // this.add(new Square(vec(0, engine.screen.height), Color.Red));
    // this.add(new Square(vec(engine.screen.width, 0), Color.Red));
    // this.add(
    //   new Square(vec(engine.screen.width, engine.screen.height), Color.Red)
    // );

    this.add(title);
    this.add(new LevelSelector("level2", "LEVEL 2", vec(700, 300), engine));
    this.add(new LevelSelector("level3", "LEVEL 3", vec(700, 500), engine));
    this.add(this.player);
  }

  override onActivate(context: ex.SceneActivationContext<unknown>): void {
    // playerClamp(this.player, this.engine);
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
    console.log("loading scene 1");
  }

  // override onActivate(context: SceneActivationContext<unknown>): void {
  //     // Called when Excalibur transitions to this scene
  //     // Only 1 scene is active at a time
  // }

  // override onDeactivate(context: SceneActivationContext): void {
  //     // Called when Excalibur transitions away from this scene
  //     // Only 1 scene is active at a time
  // }

  // override onPreUpdate(engine: Engine, elapsedMs: number): void {
  //     // Called before anything updates in the scene
  // }

  // override onPostUpdate(engine: Engine, elapsedMs: number): void {
  //     // Called after everything updates in the scene
  // }

  // override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
  //     // Called before Excalibur draws to the screen
  // }

  // override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
  //     // Called after Excalibur draws to the screen
  // }
}
