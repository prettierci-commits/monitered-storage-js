const MoniteredStorage = require("./m-storage.js");

test("update", () => {
    let s = new MoniteredStorage({ a: 1 });
    s.update([0, 1]);
    expect(s.has("a")).toEqual(false);
    expect(s.get(1)).toEqual(1);
    expect(s.changed).toEqual(true);
});

test("has: yep", () => {
    let s = new MoniteredStorage({ a: 1 });
    expect(s.has("a")).toEqual(true);
});
test("has: yes falsey", () => {
    let s = new MoniteredStorage({ a: false });
    expect(s.has("a")).toEqual(true);
});
test("has: nope", () => {
    let s = new MoniteredStorage({ a: 1 });
    expect(s.has("b")).toEqual(false);
});

test("get: existing from map", () => {
    let s = new MoniteredStorage({ a: 1 });
    expect(s.get("a")).toEqual(1);
});
test("get: existing from array", () => {
    let s = new MoniteredStorage([0, 1, 2]);
    expect(s.get(1)).toEqual(1);
});
test("get: existing from array with string number", () => {
    let s = new MoniteredStorage([0, 1, 2]);
    expect(s.get("1")).toEqual(1);
});

test("set: add to empty", () => {
    let s = new MoniteredStorage();
    expect(s.changed).toEqual(false);
    s.set("a", "boom");
    expect(s.changed).toEqual(true);
    expect(s.get("a")).toEqual("boom");
});

test("set: update map", () => {
    let s = new MoniteredStorage({ a: 1 });
    expect(s.changed).toEqual(false);
    s.set("a", "boom");
    expect(s.changed).toEqual(true);
    expect(s.get("a")).toEqual("boom");
});

test("set: add to map", () => {
    let s = new MoniteredStorage({ a: 1 });
    expect(s.changed).toEqual(false);
    s.set("b", "boom");
    expect(s.changed).toEqual(true);
    expect(s.get("b")).toEqual("boom");
});

test("set: identical in map", () => {
    let s = new MoniteredStorage({ a: 1 });
    expect(s.changed).toEqual(false);
    s.set("a", 1);
    expect(s.changed).toEqual(false);
    expect(s.get("a")).toEqual(1);
});

test("set: same reference in map", () => {
    let s = new MoniteredStorage({ a: 1 });
    expect(s.changed).toEqual(false);
    s.set("a", s.get("a"));
    expect(s.changed).toEqual(false);
    expect(s.get("a")).toEqual(1);
});

test("set: update array", () => {
    let s = new MoniteredStorage([0, 1, 2]);
    expect(s.changed).toEqual(false);
    s.set(1, "boom");
    expect(s.changed).toEqual(true);
    expect(s.get(1)).toEqual("boom");
});

test("set: update array with string number", () => {
    let s = new MoniteredStorage([0, 1, 2]);
    expect(s.changed).toEqual(false);
    s.set("1", "boom");
    expect(s.changed).toEqual(true);
    expect(s.get(1)).toEqual("boom");
    expect(s.get("1")).toEqual("boom");
});

test("set: add to array", () => {
    let s = new MoniteredStorage([0, 1, 2]);
    expect(s.changed).toEqual(false);
    s.set("b", "boom");
    expect(s.changed).toEqual(true);
    expect(s.get("b")).toEqual("boom");
});

test("set: identical in array", () => {
    let s = new MoniteredStorage([0, 1, 2]);
    expect(s.changed).toEqual(false);
    s.set(1, 1);
    expect(s.changed).toEqual(false);
    expect(s.get(1)).toEqual(1);
});

test("set: same reference in array", () => {
    let s = new MoniteredStorage([0, 1, 2]);
    expect(s.changed).toEqual(false);
    s.set(1, s.get(1));
    expect(s.changed).toEqual(false);
    expect(s.get(1)).toEqual(1);
});

test("getIn: from map in map", () => {
    let s = new MoniteredStorage({ a: { b: 2 } });
    expect(s.getIn(["a", "b"])).toEqual(2);
});

test("getIn: from array in array", () => {
    let s = new MoniteredStorage([0, [1], 2]);
    expect(s.getIn([1, 0])).toEqual(1);
});

test("getIn: from array in map", () => {
    let s = new MoniteredStorage({ a: [0, 1, 2] });
    expect(s.getIn(["a", 1])).toEqual(1);
});

test("getIn: from map in array", () => {
    let s = new MoniteredStorage([0, { a: 1 }, 2]);
    expect(s.getIn([1, "a"])).toEqual(1);
});

test("getIn: missing keyPath (error)", () => {
    let s = new MoniteredStorage({ a: 1 });
    expect(() => s.getIn(["b"])).toThrow(/Invalid keyPath/);
});

test("setIn: change map in map", () => {
    let s = new MoniteredStorage({ a: { b: 2 } });
    s.setIn(["a", "b"], "boom");
    expect(s.getIn(["a", "b"])).toEqual("boom");
});
test("setIn: add to map in map", () => {
    let s = new MoniteredStorage({ a: { b: 2 } });
    s.setIn(["a", "c"], "boom");
    expect(s.getIn(["a", "c"])).toEqual("boom");
});
test("setIn: same reference from map in map", () => {
    let s = new MoniteredStorage({ a: { b: 2 } });
    s.setIn(["a", "b"], s.getIn(["a", "b"]));
    expect(s.changed).toEqual(false);
});
test("setIn: same for map in map", () => {
    let s = new MoniteredStorage({ a: { b: 2 } });
    s.setIn(["a", "b"], 2);
    expect(s.changed).toEqual(false);
});

test("setIn: change array in array", () => {
    let s = new MoniteredStorage([0, [1], 2]);
    s.setIn([1, 0], "boom");
    expect(s.getIn([1, 0])).toEqual("boom");
});
test("setIn: add to array in array", () => {
    let s = new MoniteredStorage([0, [1], 2]);
    s.setIn([1, 1], "boom");
    expect(s.getIn([1, 1])).toEqual("boom");
});
test("setIn: same reference from array in array", () => {
    let s = new MoniteredStorage([0, [1], 2]);
    s.setIn([1, 0], s.getIn([1, 0]));
    expect(s.changed).toEqual(false);
});
test("setIn: same for array in array", () => {
    let s = new MoniteredStorage([0, [1], 2]);
    s.setIn([1, 0], 1);
    expect(s.changed).toEqual(false);
});

test("setIn: change array in map", () => {
    let s = new MoniteredStorage({ a: [0, 1, 2] });
    s.setIn(["a", 1], "boom");
    expect(s.getIn(["a", 1])).toEqual("boom");
});
test("setIn: add to array in map", () => {
    let s = new MoniteredStorage({ a: [0, 1, 2] });
    s.setIn(["a", 3], "boom");
    expect(s.getIn(["a", 3])).toEqual("boom");
});
test("setIn: same reference from array in map", () => {
    let s = new MoniteredStorage({ a: [0, 1, 2] });
    s.setIn(["a", 1], s.getIn(["a", 1]));
    expect(s.changed).toEqual(false);
});
test("setIn: same for array in map", () => {
    let s = new MoniteredStorage({ a: [0, 1, 2] });
    s.setIn(["a", 1], 1);
    expect(s.changed).toEqual(false);
});

test("setIn: change map in array", () => {
    let s = new MoniteredStorage([0, { a: 1 }, 2]);
    s.setIn([1, "a"], "boom");
    expect(s.getIn([1, "a"])).toEqual("boom");
});
test("setIn: add to map in array", () => {
    let s = new MoniteredStorage([0, { a: 1 }, 2]);
    s.setIn([1, "b"], "boom");
    expect(s.getIn([1, "b"])).toEqual("boom");
});
test("setIn: same reference from map in array", () => {
    let s = new MoniteredStorage([0, { a: 1 }, 2]);
    s.setIn([1, "a"], s.getIn([1, "a"]));
    expect(s.changed).toEqual(false);
});
test("setIn: same for map in array", () => {
    let s = new MoniteredStorage([0, { a: 1 }, 2]);
    s.setIn([1, "a"], 1);
    expect(s.changed).toEqual(false);
});

test("setIn: missing keyPath (nested new)", () => {
    let s = new MoniteredStorage({ a: 1 });
    s.setIn(["b", 0, "x"], "boom");
    expect(s.getIn(["b", 0, "x"])).toEqual("boom");
});

test("nested MoniteredStorages: has", () => {
    let n = new MoniteredStorage([0]);
    let s = new MoniteredStorage([0, n]);
    expect(s.has(1)).toEqual(true);
});
test("nested MoniteredStorages: hasIn", () => {
    let n = new MoniteredStorage([{ x: "boom" }]);
    let s = new MoniteredStorage([0, n]);
    expect(s.hasIn([1, 0, "x"])).toEqual(true);
});
test("nested MoniteredStorages: hasIn yes no", () => {
    let n = new MoniteredStorage([{ x: "boom" }]);
    let s = new MoniteredStorage([0, n]);
    expect(s.hasIn([1, 0, "missing"])).toEqual(false);
});
test("nested MoniteredStorages: get", () => {
    let n = new MoniteredStorage([0]);
    let s = new MoniteredStorage([0, n]);
    expect(s.get(1)).toEqual(n);
});
test("nested MoniteredStorages: getIn", () => {
    let n = new MoniteredStorage([{ x: "boom" }]);
    let s = new MoniteredStorage([0, n]);
    expect(s.getIn([1, 0, "x"])).toEqual("boom");
});
test("nested MoniteredStorages: set", () => {
    let n = new MoniteredStorage([0]);
    let s = new MoniteredStorage();
    s.set(0, n);
    expect(s.get(0)).toEqual(n);
});
test("nested MoniteredStorages: setIn", () => {
    let n = new MoniteredStorage([0, 1, 2]);
    let s = new MoniteredStorage({ a: { b: 0 } });
    s.setIn(["a", "c"], n);
    expect(s.getIn(["a", "c"])).toEqual(n);
    s.setIn(["a", "c", 1], "boom");
    expect(s.getIn(["a", "c", 1])).toEqual("boom");
});

test("nested MoniteredStorages: get chained", () => {
    let s = new MoniteredStorage({ a: new MoniteredStorage({ b: "chain" }) });
    expect(s.get("a").get("b")).toEqual("chain");
});

const kitchenSink = {
    crazy: true,
    list: [0, [x => -x], 2],
    number: 8,
    regex: new RegExp("test", "gi"),
    obj: {
        time: new Date(),
    },
    state: new MoniteredStorage({
        plus_5: x => x + 5,
        string: "hello world",
    }),
};
function testKitchenSink(s, c) {
    expect(s instanceof MoniteredStorage).toEqual(true);
    expect(c instanceof MoniteredStorage).toEqual(true);
    // Value checks
    expect(c.get("crazy")).toEqual(true);
    expect(c.getIn(["list", 1, 0])(10)).toEqual(-10);
    expect(c.get("number")).toEqual(8);
    expect(c.get("regex").toString()).toEqual("/test/gi");
    expect(c.getIn(["obj", "time"]) === kitchenSink.obj.time).toEqual(false);
    expect(
        c.getIn(["obj", "time"]).getTime() === kitchenSink.obj.time.getTime()
    ).toEqual(true);
    expect(c.getIn(["state", "plus_5"])(5)).toEqual(10);
    expect(c.getIn(["state", "string"])).toEqual("hello world");
    // Reference checks
    s.set("crazy", false);
    expect(kitchenSink.crazy).not.toEqual(s.get("crazy"));
    expect(c.get("crazy")).not.toEqual(s.get("crazy"));
    s.setIn(["list", 1, 0], "boom");
    expect(typeof kitchenSink.list[1][0]).toEqual("function");
    expect(typeof c.getIn(["list", 1, 0])).toEqual("function");
    expect(c.getIn(["list", 1, 0])(10)).toEqual(-10);
    s.set("number", 10);
    expect(kitchenSink.number).not.toEqual(s.get("number"));
    expect(c.get("number")).not.toEqual(s.get("number"));
}
test("copy via constructor", () => {
    let s = new MoniteredStorage(kitchenSink);
    testKitchenSink(s, new MoniteredStorage(s));
});
test("copy via clone", () => {
    let s = new MoniteredStorage(kitchenSink);
    testKitchenSink(s, s.clone());
});
