import {
  DefaultLoader,
  Engine,
  Font,
  FontUnit,
  Label,
  Scene,
  SceneActivationContext,
  vec,
} from "excalibur";
import { Player } from "./player";
import { playerClamp } from "./util";

export class Level3 extends Scene {
  player: Player;
  constructor(p: Player) {
    super();
    this.player = p;
  }
  override onInitialize(engine: Engine): void {
    // Scene.onInitialize is where we recommend you perform the composition for your game
    const title = new Label({
      text: "LEVEL 3",
      pos: vec(300, 100),
      font: new Font({
        family: "impact",
        size: 48,
        unit: FontUnit.Px,
      }),
    });
    this.add(title);

    this.add(this.player);
  }

  override onActivate(context: ex.SceneActivationContext<unknown>): void {
    this.player.pos = vec(100, 250);
		// playerClamp(this.player,this.engine);
	}

  override onPreLoad(loader: DefaultLoader): void {
    console.log("loading scene 2");
    // Add any scene specific resources to load
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
