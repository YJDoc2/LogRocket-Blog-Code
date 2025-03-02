import { Engine } from "excalibur";
import { Player } from "./player";

export function playerClamp(player: Player, engine: Engine) {
  player.pos.x %= engine.screen.width;
  if (player.pos.x < 0) {
    player.pos.x = engine.screen.width;
  }

  player.pos.y %= engine.screen.height;
  if (player.pos.y > 0) {
    player.pos.y = engine.screen.height;
  }
}
