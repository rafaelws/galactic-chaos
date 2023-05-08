# DOING

- [ ] reposition global debug to bottom right
- [x] Tests -> vitest
- [x] README
- [x] Release post
- [x] credits
- [x] boss defeated event - triggers next level
- [x] {bug} small stutter on level change (all assets are being loaded on firstLevel)
- [x] debounce start/select
- [x] {bug} audio: track overlap when actions are triggered too close to each other
- [x] {bug} objects with spawnTimeout can be destroyed by player (on the edges of the screen)
- [x] level design: first boss
- [x] level design: level 1/first level
- [x] audio not working properly after refac
- [x] fix options disappearing at the wrong time on start

# TODO

- bugs:

  - [ ] handle screen resize on game objects (affects overall dimensions and movement) (use debounce)

- features:

  - [ ] create a loading screen between levels (while the assets are being loaded)
  - [ ] player items
    - [ ] shield
    - [ ] special
  - [ ] projectile
    - [ ] {idea} deflect projectile on hit
    - [ ] {idea} piercing projectile: projectiles keeps attacking given a timeout until hp is depleated
    - [ ] {idea} projectile upgrades (size, amount, speed, rate)
    - [ ] {idea} canon / beam struggle (time event)
  - [ ] audio
    - [ ] ost (game end)
    - [ ] ui sfx (pause, re(start))
    - [ ] gameplay sfx (collision, projectile, item)
    - [ ] Web Audio API - fadeIn/Out with ramp w/ gain methods are not widely supported
    - [ ] reactive background (using WebAudioAPI. verify browser support)
  - [ ] overall status: time? score? enemies defeated? projectiles fired?

- [ ] improvements
  - [x] fade-in/out menus
  - [x] fade-in/out hud
  - [ ] replace player img
  - [ ] hitboxes
  - [ ] gampead mechanics
  - [ ] make projectile and player movement smoother
  - [ ] consider using lerp for alpha and movement (star, explosion)
  - [ ] syntax sugar: enemy profiles (code)
  - [ ] consider rewriting Input.ts with enum or const
  - [ ] request fullscreen through controller (config option)
  - [ ] docs: consider using an interactive form to showcase/test game objects (see `dat.gui`)
  - [x] projectile appearance [performance concearn using filter]
  - [ ] Gamepad:
    - [ ] PreferredInput: gamepad or keyboard/mouse (choose gamepad index?)
    - [ ] Configuration: controller stick drift (left and right)
    - [ ] if gamepad unplugged/disconnect:
      - A) look for another avaliable gamepad (if none, do A) or
      - B) go back to keyboard/mouse

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
- [x] audio (ui sfx, gameplay sfx, game end song)

  - [x] loader
  - [x] manager
  - [x] ost

    - [x] game over (short)
    - [x] level song (short)
    - [x] boss song (short)
    - [x] main menu (loop)
    - [x] pause (loop)

- [x] configuration

  - [x] settings for: enable audio, audio volume, background density
  - [x] ui configuration on game start
  - [x] ui configuration on pause (always open)
  - [x] fade-in/out options

- [x] fix Boss movement transition (with alpha)
