import {
  Actor,
  Color,
  Engine,
  Rectangle,
  Vector,
  Text,
  Font,
  FontUnit,
  GraphicsGroup,
  vec,
} from "excalibur";

export class LevelIcon extends Actor {
  label: string;
  constructor(cb: Function, pos: Vector, label: string) {
    super({
      name: "LevelIcon",
      pos: pos,
      width: 100,
      height: 100,
    });
    this.label = label;
    this.on("pointerdown", () => {
      cb();
    });
  }
  onInitialize(engine: Engine): void {
    const square = new Rectangle({
      width: 75,
      height: 75,
      color: Color.Magenta,
    });
    const title = new Text({
      text: this.label,
      font: new Font({
        family: "impact",
        size: 16,
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
          offset: vec(7, 25),
        },
      ],
    });
    this.graphics.add(group);
  }
}
