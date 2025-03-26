import {
  BoundingBox,
  Camera,
  CameraStrategy,
  Engine,
  vec,
  Vector,
} from "excalibur";
import { Player } from "./player";

export class BoundingBoxAroundActor implements CameraStrategy<Player> {
  target: Player;
  bounds: BoundingBox;
  constructor(target: Player, box: BoundingBox) {
    this.target = target;
    this.bounds = box;
  }
  action(
    target: Player,
    camera: Camera,
    engine: Engine,
    elapsed: number
  ): Vector {
    let pos = target.center;
    const focus = camera.getFocus();
    let focusX = focus.x;
    let focusY = focus.y;
    let box = this.bounds;
    if (pos.x < box.left + engine.halfDrawWidth) {
      focusX = box.left + engine.halfDrawWidth;
    } else if (pos.x > box.right - engine.halfDrawWidth) {
      focusX = box.right - engine.halfDrawWidth;
    } else {
      focusX = pos.x;
    }

    if (pos.y < box.top + engine.halfDrawHeight) {
      focusY = box.top + engine.halfDrawHeight;
    } else if (pos.y > box.bottom - engine.halfDrawHeight) {
      focusY = box.bottom - engine.halfDrawHeight;
    } else {
      focusY = pos.y;
    }

    return vec(focusX, focusY);
  }
}
