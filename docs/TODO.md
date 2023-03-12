# TODO

- [ ] ui: configurations (>enable audio, >audio volume [ost, effects], >bg density, choose input, credits?)
- [ ] fix Boss movement transition
- [ ] fix audio transition
- [ ] debug points on bezier curves
- [ ] level design
- [ ] audio (ui sfx, gameplay sfx, game end song)

  - [x] loader
  - [x] manager
  - [x] ost
    - [ ] game end (short)
    - [x] game over (short)
    - [x] level song (short)
    - [x] boss song (short)
    - [x] main menu (loop)
    - [x] pause (loop)
  - [ ] ui sfx
    - [ ] pause, (re)start
    - [ ] ui "tick"
  - [ ] gameplay sfx (collision, projectile, item)

- [ ] improvements

  - [x] projectile appearance [performance concearn using filter]
  - [ ] verify performance issues
  - [ ] gampead mechanics
  - [ ] replace player img
  - [ ] consider using lerp for alpha (star, explosion)
  - [ ] consider rewriting Input.ts with enum or const

- [ ] docs: consider using an interactive form to showcase game objects (see `dat.gui`)

# Known Issues

- Movement is instantiated once per object. If the world boundaries, frame time (monitor frequency) or object dimensions change, the movement will not behave as expected.
- Dimensions are set once per object. If the world boundaries change (resize), the object's won't.

# Backlog

- [ ] player items
  - [ ] shield
  - [ ] special
- [ ] projectile
  - [ ] {idea} deflect projectile on hit (that would be cool)
  - [ ] {idea} piercing projectile: projectiles keeps attacking given a timeout until hp is depleated
  - [ ] {idea} projectile upgrades (size, amount, speed, rate)
- [ ] {bug} handle screen resize on game objects
- [ ] {low} overall status: time? score? enemies killed? shots fired?` (use LevelManager)
- [ ] {low}{idea} ship: add 2 movement patterns ship movement (using sin, cos)
- [ ] {low}{idea} canon / beam struggle (time event)
- [ ] {low}{idea} syntax sugar: enemy profiles
- [ ] {research} look for similar games (reference)
- [ ] {research} look for svg copyleft/cc0 assets
- [ ] improve projectile hitbox
- [ ] improve player hitbox
- [ ] Web Audio API - fadeIn/Out with ramp w/ gain methods are not widely supported
- [ ] reactive background (using WebAudioAPI. verify browser support)

# DONE

- [x] HUD
- [x] UI
- [x] player items (basics)
  - [x] hp
  - [x] spawn items using event
- [x] assets
  - [x] font (orbitron) [check Saira]
  - [x] loader and images (player, enemies, items...)
  - [x] loader, audio and audio manager
- [x] level manager
- [x] enemies
  - [x] rock
  - [x] ship
  - [x] bosses
- [x] mechanics

  - [x] game objects collision
    - [x] enemies[] collision > player (event)
    - [x] enemy projectiles[] collision > player (event)
    - [x] player projectiles[] collision > enemies[] (notify)
    - [x] notify game objects on collision
  - [x] game object params (hp, spawnTimeout, spawnables, impact{power,resistance,collisionTimeout})
    - [x] rock
    - [x] ship
    - [x] projectile (color, power)
    - [x] player
  - [x] overlap damage image when hp is depleated (player)
  - [x] gamepad

- [x] effects

  - [x] animations (e.g. projectile hit/collision effect)
  - [x] background particles

- [x] refac1 (maintainability iteration)

  - [x] clock utility
  - [x] can a class called GameObject be created to simplify some stuff?
  - [x] can some types/interfaces be shared?
  - [x] {refac} ship (with GameObject and Clock)
  - [x] {refac} rock (with GameObject and Clock)
  - [x] {refac} projectile
  - [x] {refac} player
  - [x] simplify and use Concrete when necessary
  - [x] upload to a remote to prevent data loss

- [x] refac2

  - [x] {refac} Make player a game object (setControls, extends GameObject)
  - [x] {bug} fix Projectile hitbox (palliative)
  - [x] {refac} Use events to spawn enemy projectiles
  - [x] {bug} if a Ship is destroyed, its projectiles vanish (solved by previous item)
  - [x] {bug} fix level manager step function

- misc

  - [x] {improvement} projectile appearance
  - [x] {bug|improve} gamepad (make it work interchangeably with keyboard/mouse)
    - [x] solution: on ANY menu, the game is notified of the preferred input
  - [x] {improvement} circle collision calculation (without sqrt)

- [x] New Movement Implementation

  - [x] "fluent" way to create movement params
  - [x] Boss
  - [x] fix movement end
  - [x] multiple steps
  - [x] repeatable
  - [x] Rock
  - [x] Ship
  - [x] draw debug lines
  - [x] lerp, quadratic bezier, cubic bezier

- [x] granular debug for game objects
