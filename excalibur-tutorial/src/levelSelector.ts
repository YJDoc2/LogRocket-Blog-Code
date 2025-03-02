import {
  Actor,
  Color,
  Engine,
  Font,
  FontUnit,
  Rectangle,
  vec,
  Vector,
  Text,
  GraphicsGroup,
  Collider,
  CollisionContact,
  Side,
} from "excalibur";
import { Player } from "./player";

export class LevelSelector extends Actor {
  next: string;
  label: string;
  engine: Engine;
  constructor(levelName: string, label: string, pos: Vector, engine: Engine) {
    super({
      name: "LevelSelector",
      pos: pos,
      width: 100,
      height: 100,
    });
    this.next = levelName;
    this.label = label;
    this.engine = engine;
  }
  onInitialize(engine: Engine): void {
    const square = new Rectangle({
      width: 50,
      height: 50,
      color: Color.Magenta,
    });
    const title = new Text({
      text: this.label,
      font: new Font({
        family: "impact",
        size: 12,
        unit: FontUnit.Px,
      }),
    });
    let group = new GraphicsGroup({
      members: [
        {
          graphic: square,
          offset: vec(0, 0),
        },
        {
          graphic: title,
          offset: vec(0, 60),
        },
      ],
    });
    this.graphics.add(group);
  }
  onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    if (other.owner instanceof Player) {
      this.engine.goToScene(this.next);
    }
  }
}
