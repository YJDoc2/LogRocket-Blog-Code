import {
  Actor,
  Engine,
  SpriteSheet,
  vec,
  Vector,
  Animation,
  AnimationStrategy,
  range,
  EventEmitter,
} from "excalibur";
import { Resources } from "./resources";
import {
  GOBLIN_ATTACK_COOLDOWN,
  GOBLIN_ATTACK_DISTANCE,
  GOBLIN_DETECTION_DISTANCE,
  GOBLIN_WALK_DISTANCE,
  PLAYER_ATTACK_RANGE,
} from "./constant";
import { Player } from "./player";

export class Goblin extends Actor {
  idleAnimationRight: Animation;
  idleAnimationLeft: Animation;
  walkingAnimationLeft: Animation;
  walkingAnimationRight: Animation;
  attackAnimationRight: Animation;
  attackAnimationLeft: Animation;
  facingRight: boolean;
  events: EventEmitter;
  health = 3;
  attacking = false;
  lastAttack = 0;

  player: Player | null = null;
  constructor(startPos: Vector, events: EventEmitter) {
    super({
      name: "Goblin",
      pos: startPos,
      width: 100,
      height: 100,
      z: 7,
      scale: vec(1, 1),
    });
    this.events = events;
    this.facingRight = true;
    let spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.Goblin,
      grid: {
        rows: 8,
        columns: 6,
        spriteWidth: 192,
        spriteHeight: 192,
      },
    });
    this.idleAnimationRight = Animation.fromSpriteSheet(
      spriteSheet,
      range(0, 6),
      100,
      AnimationStrategy.Loop
    );

    this.idleAnimationLeft = this.idleAnimationRight.clone();
    this.idleAnimationLeft.flipHorizontal = true;

    this.walkingAnimationRight = Animation.fromSpriteSheet(
      spriteSheet,
      range(7, 12),
      100,
      AnimationStrategy.Loop
    );
    this.walkingAnimationLeft = this.walkingAnimationRight.clone();
    this.walkingAnimationLeft.flipHorizontal = true;

    this.attackAnimationRight = Animation.fromSpriteSheet(
      spriteSheet,
      range(13, 18),
      100,
      AnimationStrategy.Freeze
    );
    this.attackAnimationRight.events.on("end", (a) => {
      this.attacking = false;
    });
    this.attackAnimationLeft = this.attackAnimationRight.clone();
    this.attackAnimationLeft.flipHorizontal = true;
    this.attackAnimationLeft.events.on("end", (a) => {
      this.attacking = false;
    });
  }
  onInitialize(engine: Engine): void {
    this.graphics.use(this.idleAnimationRight);
    for (const a of engine.currentScene.actors) {
      if (a instanceof Player) {
        this.player = a;
      }
    }
    this.events.on("attack", ({ pos, right }) => {
      let diff = this.pos.sub(pos).magnitude;
      if (diff > PLAYER_ATTACK_RANGE) {
        return;
      }

      if ((pos.x < this.pos.x && right) || (pos.x > this.pos.x && !right)) {
        this.health -= 1;
        if (this.health <= 0) {
          this.kill();
        }
      }
    });
  }

  update(engine: Engine, elapsed: number) {
    super.update(engine, elapsed);

    let playerPos = this.player?.pos || vec(Infinity, Infinity);
    let diff = this.pos.sub(playerPos);
    let dist = diff.magnitude;
    let now = Date.now();

    if (dist < GOBLIN_DETECTION_DISTANCE && dist > GOBLIN_ATTACK_DISTANCE) {
      let step = diff.normalize().negate().scale(GOBLIN_WALK_DISTANCE);
      this.pos = this.pos.add(step);
      if (step.x < 0) {
        this.facingRight = false;
        this.graphics.use(this.walkingAnimationLeft);
      } else {
        this.facingRight = true;
        this.graphics.use(this.walkingAnimationRight);
      }
      this.attacking = false;
    } else if (
      dist < GOBLIN_ATTACK_DISTANCE &&
      now - this.lastAttack > GOBLIN_ATTACK_COOLDOWN
    ) {
      if (!this.attacking) {
        this.attacking = true;
        this.attackAnimationLeft.reset();
        this.attackAnimationRight.reset();
        if (this.facingRight) {
          this.graphics.use(this.attackAnimationRight);
        } else {
          this.graphics.use(this.attackAnimationLeft);
        }
        this.events.emit("enemy-attack", {});
        this.lastAttack = now;
      }
    } else if (!this.attacking) {
      if (this.facingRight) {
        this.graphics.use(this.idleAnimationRight);
      } else {
        this.graphics.use(this.idleAnimationLeft);
      }
    }
  }
}
