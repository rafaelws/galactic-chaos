# NEXT (>doing)

- [>] effects
  - [>] effects and animations (e.g. hit/collision effect)
  - [x] background: particles
- [ ] audio
  - [ ] loader
  - [ ] manager
  - [ ] reactive background (WebAudioAPI - verify browser support)
- [ ] level design (design level1)
- [ ] improvements
  - [x] circle collision calculation (without sqrt)
  - [ ] projectile hitbox
  - [ ] player hitbox
  - [ ] verify performance issues

# TODO (> planned)

- [>] gamepad
- [>] assets

  - [x] fonts: ui, hud (Orbitron)
  - [>] effects and animations (e.g. hit/collision effect)
  - [>] asset loader: audio
  - [>] audio: ui
  - [>] audio: ost

- [ ] {low} projectile

  - [x] appearance (image? bloom effect?)
  - [>] {idea} deflect projectile on hit (that would be cool)
  - [ ] {idea} piercing projectile: projectiles keeps attacking given a timeout until hp is depleated
  - [ ] ability to change speed

- [>] level design
- [ ] {bug} handle screen resize on game objects
- [ ] {low} overall status: time? score? enemies killed? shots fired?` (use LevelManager)
- [ ] {low}{idea} ship: add 2 movement patterns ship movement (using sin, cos)
- [ ] {low}{idea} canon / beam struggle (time event)
- [ ] {low}{idea} syntax sugar: enemy profiles
- [ ] {research} look for similar games (reference)
- [ ] {research} look for svg copyleft/cc0 assets

# DONE

- [x] HUD
- [x] UI
- [ ] player items
  - [x] hp
  - [ ] shield
  - [ ] special
  - [x] spawn items using event
- [ ] assets:
  - [x] loader and images (player, enemies, items...)
  - [ ] loader, audio and audio manager
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
  - [x] {improve} projectile appearance
  - [x] {bug|improve} gamepad (make it work interchangeably with keyboard/mouse)
    - [x] solution: on ANY menu, the game is notified of the preferred input

---

```
Game Events:
 - [x] quit
 - [x] pause
 - [x] spawn (gameObject)
 - [x] gameover
 - [x] gameend

- - -

Gamepad Cheatsheet:

left analog stick
- axes[0] = negative: left, positive: right (horizontal)
- axes[1] = negative: up, positive: down (vertical)

right analog stick
- axes[2] = negative: left, positive: right (horizontal)
- axes[3] = negative: up, positive: down (vertical)

A / x:         buttons[0]
B / circle:    buttons[1]
X / square:    buttons[2]
Y / triangle:  buttons[3]

LB / L1:       buttons[4]
RB / R1:       buttons[5]
LT / L2:       buttons[6]
RT / R2:       buttons[7]

SELECT:        buttons[8]
START:         buttons[9]

L axes click:  buttons[10]
R axes click:  buttons[11]
d_up:          buttons[12]
d_down:        buttons[13]
d_left:        buttons[14]
d_right:       buttons[15]
x/ps:          buttons[16]
```
