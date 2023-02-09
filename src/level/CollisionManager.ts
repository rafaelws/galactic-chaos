import { hasCollided } from "@/common/math";
import { Coordinate, Drawable, GameState } from "@/common/meta";
import { iterate } from "@/common/util";
import {
  Explosion,
  ExplosionProfileName,
  GameObject,
  inferExplosionProfile,
  Player,
} from "@/objects";
import { EffectType } from "@/objects/shared";

export class CollisionManager implements Drawable {
  private drawables: Drawable[] = [];

  constructor(private readonly player: Player) {}

  public get isActive() {
    return true;
  }

  private addExplosion(where: Coordinate, profile: ExplosionProfileName) {
    this.drawables.push(new Explosion({ epicenter: where, profile }));
  }

  public check(gameObject: GameObject): void {
    // verify player against gameObject
    if (
      gameObject.isActive &&
      hasCollided(this.player.hitbox, gameObject.hitbox)
    ) {
      const effect = gameObject.effect();
      const hadEffect = effect.amount > 0;
      this.player.handleEffect(effect);
      gameObject.handleEffect(hadEffect ? this.player.effect() : effect);

      if (hadEffect) {
        this.addExplosion(
          this.player.hitbox,
          inferExplosionProfile(effect.type)
        );
      }
    }

    // verify projectiles against gameObject
    iterate(this.player.ownProjectiles, (p) => {
      if (p.isActive && hasCollided(p.hitbox, gameObject.hitbox)) {
        const { type } = gameObject.effect();

        if (type === EffectType.impact || type === EffectType.projectile) {
          gameObject.handleEffect(p.effect());
          p.handleEffect(p.effect());

          this.addExplosion(
            gameObject.hitbox,
            type === EffectType.projectile
              ? ExplosionProfileName.projectileImpact
              : ExplosionProfileName.playerProjectileImpact
          );
        }
      }
    });
  }

  public update(state: GameState): void {
    let actives: Drawable[] = [];
    iterate(this.drawables, (d) => {
      d.update(state);
      if (d.isActive) actives.push(d);
    });
    this.drawables = actives;
  }

  public draw(c: CanvasRenderingContext2D): void {
    iterate(this.drawables, (d) => d.draw(c));
  }
}
