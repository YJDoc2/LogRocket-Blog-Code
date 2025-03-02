import { Actor, Color, Engine, Rectangle, Vector } from "excalibur";

export class Square extends Actor {
  col: Color;
  constructor(startPos: Vector, col: Color) {
    super({
      name: "square",
      pos: startPos,
      width: 100,
      height: 100,
    });
    this.col = col;
  }
  onInitialize(engine: Engine): void {
    this.graphics.add(
      new Rectangle({ width: 50, height: 50, color: this.col })
    );
  }
}
