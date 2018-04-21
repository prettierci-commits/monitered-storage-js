# MoniteredStorage.js
> JavaScript storage library that moniters when it has been changed. Inspired by [Immutable.js](https://facebook.github.io/immutable-js/).

This library was originally written as the backend for some custom web component style work, where only elements that have updated are rendered. Each storage can hold any array or object and checks writes to see if that structure has updated.

## Usage

### Setup

Client side:
```html
<script src="./m-storage.js"></script>
```

Otherwise:
```js
const MoniteredStorage = require("m-storage.js");
```

### Constructor

MoniteredStorage takes an array, object, or another MoniteredStorage as its parameter. It makes a deep copy of this data. An empty constructor will default to an empty object.

```js
const state = new MoniteredStorage({
    a: 7,
    b: [ 0, 1, 2 ],
    c: new MoniteredStorage()
});
const copy = new MoniteredStorage(state);
const clone = copy.clone();
```

### Changed?

Each MoniteredStorage has a property `.changed` which will be true of any of its contents have been modified. Right now, this flag is manually set back to false.

```js
if (state.changed) {
    // mix until throughly combined
    state.changed = false;
}
```

### Getting and Setting

MoniteredStorage uses `.get(key|index)` and `.set(key|index, value)` to access and change its contents. When setting, MoniteredStorage checks if the new value equals the old value before storing and updates `.changed` if it doesn't.

```js
state.get("apples"); // 7
state.set("apples", 7);
state.changed === false
state.set("apples", 100);
state.changed === true
```

Both get and set can be used to reach deeper parts of the data by passing an array as a key to `.getIn()` or `.setIn()`.

```js
const state = new MoniteredStorage({
    people: [
        {
            name: {
                first: "Frank",
                last: "Sammich"
            },
            city: "Philadelphia",
            married: false
        },
        {
            name: {
                first: "Carlos",
                last: "Jawn"
            },
            city: "Philadelphia",
            married: false
        }
    ]
});
state.setIn(["people", 0, "name", "last"], "Jawn");
state.setIn(["people", 0, "married"], true);
state.setIn(["people", 1, "married"], true);
```

You can also use `.has` and `.hasIn` to check if an index exists in storage.

## Development

`m-storage.js` is formatted with [Prettier](https://prettier.io).

`m-storage.min.js` is compressed with Google Closure Compiler.

Tests are powered by [Jest](https://facebook.github.io/jest/)

Run tests with `npm test`.
