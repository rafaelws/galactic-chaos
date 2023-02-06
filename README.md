# NEXT (>doing)

- [x] game event: game over
- [>] game event: game end
- [ ] level design (design level1)
- [ ] {improve} player hitbox
- [ ] {improve} projectile hitbox and appearance (image? bloom effect?)
- [ ] {bug} gamepad (make it work interchangeably with keyboard/mouse)

# TODO (> planned)

- [>] gamepad
- [>] assets

  - [x] fonts: ui, hud (Orbitron)
  - [>] audio: ost, ui
  - [>] effects and animations (e.g. hit/collision effect)
  - [>] asset loader: audio

- [ ] {low} projectile

  - [>] {idea} deflect projectile on hit (that would be cool)
  - [>] appearance (image? bloom effect?)
  - [ ] {idea} piercing projectile: projectiles keeps attacking given a timeout until hp is depleated
  - [ ] ability to change speed

- [>] level design
- [>] (!) background: dynamic, with particles, reacting to the bg music (depends on OST and audio loader/manager)
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
- [x] {assets} images: player, enemies, items
- [x] {asset loader} image
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
  - [x] game object params (hp, impact{power,resistance,collisionTimeout}, projectile{impact{power}})
    - [x] rock
    - [x] ship
    - [x] projectile
    - [x] player
  - [x] overlap damage image when hp is depleated (player)
  - [ ] gamepad

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

---

```
Game Events:
 - [x] quit
 - [x] pause
 - [x] spawn (gameObject)
 - [x] gameover
 - [>] gameend

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
