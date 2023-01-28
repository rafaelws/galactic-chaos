# TODO

- [ ] refac 2

  - [x] {refac} Make player a game object (setControls, extends GameObject)
  - [>] {bug} fix Projectile hitbox
  - [>] {refac} Use events to spawn everything (start with projectiles, listen to the event on LevelManager and add to the drawables array - rename to gameObjects)
  - [>] {bug} if a Ship is destroyed, its projectiles vanish (the projectiles should live by themselves)
  - [>] {bug} fix level manager step function
  - [ ] configure eslint

- [ ] {feature} player items and status

  - [ ] items (at least heal and shield) (spawn items using event)
  - [ ] overlap damage image when hp is depleated

- [ ] {feature} bosses
- [ ] {feature} ship: add 2 movement patterns ship movement

- [ ] {?} syntax sugar: enemy profiles

# BASIC

- [x] {assets} images: player, enemies, items
- [x] {asset loader} image
- [x] level manager
- [x] enemies
  - [x] rock
  - [x] ship (see TODO)
  - [ ] bosses
- [x] mechanics

  - [x] game objects collision
    - [x] enemies[] collision > player (event)
    - [x] enemy projectiles[] collision > player (event)
    - [x] player projectiles[] collision > enemies[] (notify)
    - [x] notify game objects on collision
  - [x] game object params (hp, impact{power,resistance,collisionTimeout}, projectile power)
    - [x] rock
    - [x] ship
    - [x] projectile
    - [x] player

- [x] maintainability iteration (refac1)

  - [x] clock utility
  - [x] can a class called GameObject be created to simplify some stuff?
  - [x] can some types/interfaces be shared?
  - [x] ship (with GameObject and Clock)
  - [x] rock (with GameObject and Clock)
  - [x] projectile
  - [x] player
  - [x] simplify and use Concrete when necessary
  - [x] upload to a remote to prevent data loss

# Nice-to-haves

- [ ] {player items}: spawn (drop when an enemy is killed), effects (collision event)
- [ ] HUD
- [ ] UI
- [ ] level design
- [ ] gamepad
- [ ] {asset loader} audio
- [ ] assets

  - [ ] effects and animations (e.g. hit/collision effect)
  - [ ] audio: ost, ui
  - [>] image: projectiles
  - [>] fonts: ui, hud (Orbitron)

- [ ] handle resize on game objects (Projectile, Ship, Rock, Player...)
- [ ] background (dynamic, with particles, reacting to the bg music)
- [ ] overall status: time? score? enemies killed? shots fired?` (use LevelManager)
- [ ] {idea} piercing projectile: projectiles keeps attacking given a timeout until hp is depleated

---

```
Gamepad Cheatsheet:

left analog stick
- axes[0]: negative: left, positive: right (horizontal)
- axes[1]: negative: up, positive: down (vertical)

right analog stick
- axes[2]: negative: left, positive: right (horizontal)
- axes[3]: negative: up, positive: down (vertical)

A / xis:       buttons[0]
B / circulo:   buttons[1]
X / quadrado:  buttons[2]
Y / triangulo: buttons[3]

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
x/ps (joker):  buttons[16]
```

```
// TODO
function requestFullscreen() {
  const vendors = [
    "requestFullscreen",
    "requestFullScreen",
    "mozRequestFullScreen",
    "webkitRequestFullScreen",
    "msRequestFullscreen",
  ];
  const root = document.querySelector("#root")!;
  const method = vendors.find((name) => name in root);
  if (method) (root as HTMLElement)[method]();
}

```
