# fp-ts-animation

## This is a demo, not a library (yet?)

`fp-ts` port of [Bkase's `swift-fp-animation`](https://github.com/bkase/swift-fp-animations) & their slides; ["Algebraic Animation"](https://bkase.github.io/slides/animations-semirings/#/) 

# Example
You can run examples by using `parcel`:
```
yarn add global parcel-bundler
parcel examples/jquery/index.html
```
From `examples/jquery`:
```
const opacityAnimation = pipe(
  duration(5000),
  map(opacity)
);

//map - from functor instance
const scaleAnimation = pipe(
  duration(5000),
  map(repeat(4)),
  map(reversable),
  map(scale)
);

//add - from semiring instance
//do both at the same time
const animation = pipe(
  semiringStyleAnimation.add(scaleAnimation, opacityAnimation),
  map(render(elem))
);

run(rafScheduler)(animation);
```