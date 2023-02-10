```
NOTES for the exp.share/'post mortem':

- why making a game?
- math, trigonometry
- not ideal design choices
  - inheritance caveats - turning behavior composable
  - "why haven't you used an engine?"
  - ended rushing some features (e.g. items, player damage)
  - nothing is responsive (resize)
  - approach: let the idea out, struggle, make it work, struggle a bit more, refactor
```

The struggle with inheritance:

- At some point, the GameObject class became way too big and concentrated a lot of properties and behaviors.

At first it helped automating most things. Subclasses became thinner... Until some behaviors needed refinement.
In that case, the parent class became a hindrance with its (now) rigid implementation.
Insisting on this approach for each new feature, would make the parent class grow even bigger and eventually messy enough to the point of being unmaintainable.

Too much automated behavior turned out to obscure important funcionallity detail when reading the source after some time.

In an attempt to solve this, some specialized classes were created for each behavior.

It ended with more code, but it felt like the better way in the end.
