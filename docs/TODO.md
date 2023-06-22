# NEXT

## Features
 - [ ] live docs
 - [ ] level designer

## Tools & Processes
 - [x] husky, lint-staged
 - [x] commit messages (cz, commitlint)
 - [ ] versioning (semver)
 - [ ] changelog

## Fixes/Improvements
 - [ ] communicate player of controls (use menus)
 - [ ] handle screen resize on game objects (affects overall dimensions and movement) (use debounce)
 - [ ] polish game end
 - [ ] rewrite hud and menus as web components?
 - [ ] remove unecessary colors from sourcecode

## To Consider
 - [ ] game assets: either simplify asset loading or change to a simplified neon line style (without external assets)
 - [ ] change/simplify mechanics

---

# TODO
- [x] create a loading screen between levels (while the assets are being loaded)
- [ ] player 
  - [x] radar
  - [ ] shield (item)
  - [ ] special (item)
- [ ] projectile
  - [ ] {idea} deflect projectile on hit
  - [ ] {idea} piercing projectile: projectiles keeps attacking given a timeout until hp is depleated
  - [ ] {idea} projectile upgrades (size, amount, speed, rate)
  - [ ] {idea} canon / beam struggle (time event)
- [ ] audio
  - [ ] ost (game end)
  - [ ] ui sfx (pause, re(start))
  - [ ] gameplay sfx (collision, projectile, item)
  - [ ] reactive background (using WebAudioAPI; verify browser support)
  - [ ] fadeIn/Out with Web Audio API (gain ramp methods are not widely supported)
- [ ] overall status: time? score? enemies defeated? projectiles fired?
- [ ] make projectile and player movement smoother
- [ ] use lerp for alpha and movement (Star, ExplosionParticle)
- [ ] better hitboxes
- [ ] better gampead mechanics
- [ ] syntax sugar: enemy profiles (code)
- [ ] request fullscreen (+config option)
- [x] projectile appearance [performance concearn using filter]
- [x] fade-in/out menus
- [x] fade-in/out hud
- [ ] use sprites (review canvas performance and load time)
- [ ] (UI) tooling: consider using an interactive form to showcase/test game objects (see `dat.gui`, `lil-gui`)
- [ ] (UI) tooling: level designer
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
  - [x] can a class be created to simplify some stuff (GameObject)?
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

---

  - [x] {improvement} projectile appearance
  - [x] {bug|improve} gamepad (make it work interchangeably with keyboard/mouse)
    - [x] solution: on ANY menu, the game is notified of the preferred input
  - [x] {improvement} circle collision calculation (without sqrt)


- [x] New Movement Implementation

  - [x] FluentMovement
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
- [x] level design: first boss
- [x] level design: level 1/first level
- [x] debounce start/select
- [x] {bug} small stutter on level change (all assets are being loaded on firstLevel)
- [x] {bug} audio: track overlap when actions are triggered too close to each other
- [x] {bug} objects with spawnTimeout can be destroyed by player (on the edges of the screen)
- [x] update inner game event system (replace browser event system with internal pub/sub solution)
- [x] eslint
- [x] listen to player and boss hp on LevelManager (remove from Player and Boss)
- [x] {bug} (event) bg density not updating
- [x] {bug} Joystick disconnected
- [x] disable arrows everywhere (wasd only)
- [x] update menus to use q to pause/unpause (q=START, e=SELECT)
- [x] *{bug} audio overlap (reincident)
- [x] (Asset Loading) every level should load ALL the assets it will use (level-independent asset loading)
- [x] (Asset Loading) trigger "loading state" while a level is loading
- [x] pub on PubSub made async
- [x] radar