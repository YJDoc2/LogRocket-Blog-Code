import {
  Actor,
  Engine,
  Keys,
  SpriteSheet,
  vec,
  Vector,
  Animation,
  AnimationStrategy,
  range,
  CollisionType,
  BoundingBox,
  EventEmitter,
} from "excalibur";
import { Resources } from "./resources";
import { PLAYER_WALK_DISTANCE } from "./constant";
import { BoundingBoxAroundActor } from "./cameraStrategy";

export class Player extends Actor {
  idleAnimationRight: Animation;
  idleAnimationLeft: Animation;
  walkingAnimationLeft: Animation;
  walkingAnimationRight: Animation;
  attackAnimationLeft: Animation;
  attackAnimationRight: Animation;
  facingRight: boolean;
  events: EventEmitter;
  attacking: boolean = false;
  health = 10;
  constructor(startPos: Vector, events: EventEmitter) {
    super({
      name: "Player",
      pos: startPos,
      width: 100,
      height: 100,
      z: 10,
      collisionType: CollisionType.Active,
      scale: vec(1, 1),
    });
    this.events = events;
    this.facingRight = true;
    let spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Knight,
      grid: {
        rows: 8,
        columns: 6,
        spriteWidth: 192,
        spriteHeight: 192,
      },
    });
    this.idleAnimationRight = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 5),
      100,
      AnimationStrategy.Loop
    );

    this.idleAnimationLeft = this.idleAnimationRight.clone();
    this.idleAnimationLeft.flipHorizontal = true;

    this.walkingAnimationRight = Animation.fromSpriteSheet(
      spriteSheet,
      range(6, 11),
      100,
      AnimationStrategy.Loop
    );
    this.walkingAnimationLeft = this.walkingAnimationRight.clone();
    this.walkingAnimationLeft.flipHorizontal = true;

    this.attackAnimationRight = Animation.fromSpriteSheet(
      spriteSheet,
      range(12, 17),
      100,
      AnimationStrategy.Freeze
    );
    this.attackAnimationRight.events.on("end", (a) => {
      this.events.emit("attack", { pos: this.pos, right: this.facingRight });
      this.attacking = false;
    });
    this.attackAnimationLeft = this.attackAnimationRight.clone();
    this.attackAnimationLeft.flipHorizontal = true;
    this.attackAnimationLeft.events.on("end", (a) => {
      this.events.emit("attack", { pos: this.pos, right: this.facingRight });
      this.attacking = false;
    });
  }
  onInitialize(engine: Engine): void {
    let boundingBox = new BoundingBox(
      0,
      0,
      engine.currentScene.tileMaps[0].width,
      engine.currentScene.tileMaps[0].height
    );
    engine.currentScene.camera.addStrategy(
      new BoundingBoxAroundActor(this, boundingBox)
    );
    this.graphics.use(this.idleAnimationRight);
    this.events.on("enemy-attack", () => {
      this.health -= 1;
      if (this.health <= 0) {
        this.kill();
      }
    });
  }

  update(engine: Engine, elapsed: number) {
    super.update(engine, elapsed);

    let updateVector = null;
    let idle = false;

    let attacking = this.attacking;

    if (engine.input.keyboard.isHeld(Keys.ArrowRight) && !attacking) {
      this.facingRight = true;
      updateVector = vec(PLAYER_WALK_DISTANCE, 0);
    } else if (engine.input.keyboard.isHeld(Keys.ArrowLeft) && !attacking) {
      this.facingRight = false;
      updateVector = vec(-PLAYER_WALK_DISTANCE, 0);
    } else if (engine.input.keyboard.isHeld(Keys.ArrowUp) && !attacking) {
      updateVector = vec(0, -PLAYER_WALK_DISTANCE);
    } else if (engine.input.keyboard.isHeld(Keys.ArrowDown) && !attacking) {
      updateVector = vec(0, PLAYER_WALK_DISTANCE);
    } else {
      updateVector = vec(0, 0);
      idle = true;
    }
    this.pos = this.pos.add(updateVector);
    if (!attacking) {
      if (engine.input.keyboard.wasPressed(Keys.Space)) {
        this.attacking = true;
        this.attackAnimationLeft.reset();
        this.attackAnimationRight.reset();
        if (this.facingRight) {
          this.graphics.use(this.attackAnimationRight);
        } else {
          this.graphics.use(this.attackAnimationLeft);
        }
      } else if (idle) {
        if (this.facingRight) {
          this.graphics.use(this.idleAnimationRight);
        } else {
          this.graphics.use(this.idleAnimationLeft);
        }
      } else {
        if (this.facingRight) {
          this.graphics.use(this.walkingAnimationRight);
        } else {
          this.graphics.use(this.walkingAnimationLeft);
        }
      }
    }
  }
}
