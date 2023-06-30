# ДЗ к лекции База#21

## Необходимо реализовать функцию curry с поддержкой "дырок"

```js
const diff = curry((a, b) => a - b);

console.log(diff(curry._, 10)(15)); // 5
```

## Необходимо реализовать функцию compose для композиции функций

```js
const f = compose(
	(a) => a ** 2,
	(a) => a * 10,
	(a) => a + 1,
	(a) => Math.sqrt() // Первая
);

console.log(f(16)); // 1600
```