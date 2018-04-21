class MoniteredStorage {
    constructor(state) {
        this._store(state);
        this.changed = false;
    }

    update(state) {
        this._store(state);
        this.changed = true;
    }

    _store(state) {
        if (typeof state === "undefined") {
            this.data = {};
        } else if (state instanceof MoniteredStorage) {
            this.data = this._copy(state.data);
        } else {
            this.data = this._copy(state);
        }
    }

    _copy(op) {
        if (op instanceof MoniteredStorage) {
            return new MoniteredStorage(this._copy(op.data));
        }
        switch (toString.call(op)) {
            case "[object Array]":
                return op.map(this._copy.bind(this));
            case "[object Boolean]":
                return op ? true : false;
            case "[object Date]":
                return new Date(op.getTime());
            case "[object Function]":
                return op;
            case "[object Number]":
                return op + 0;
            case "[object Object]":
                let co = {};
                for (let key in op) {
                    co[key] = this._copy(op[key]);
                }
                return co;
            case "[object RegExp]":
                return new RegExp(op);
            case "[object String]":
                return op + "";
            default:
                // Known cases:
                // - HTML elements
                return op;
        }
    }

    clone() {
        return new MoniteredStorage(this._copy(this.data));
    }

    has(key) {
        return key in this.data;
    }
    hasIn(keyPath) {
        let loc = this.data;
        for (var i = 0; i < keyPath.length; i++) {
            const exists =
                loc instanceof MoniteredStorage
                    ? loc.has(keyPath[i])
                    : keyPath[i] in loc;
            if (!exists) {
                return false;
            }
            loc =
                loc instanceof MoniteredStorage
                    ? loc.get(keyPath[i])
                    : loc[keyPath[i]];
        }
        return true;
    }

    get(key) {
        return this.data[key];
    }
    getIn(keyPath) {
        let ret = this.data;
        for (var i = 0; i < keyPath.length; i++) {
            const exists =
                ret instanceof MoniteredStorage
                    ? ret.has(keyPath[i])
                    : keyPath[i] in ret;
            if (!exists) {
                throw Error("Invalid keyPath (at " + keyPath[i] + ")");
            }
            ret =
                ret instanceof MoniteredStorage
                    ? ret.get(keyPath[i])
                    : ret[keyPath[i]];
        }
        return ret;
    }
    set(key, value) {
        if (this.get(key) !== value) {
            this.changed = true;
            this.data[key] = value;
        }
    }
    setIn(keyPath, value) {
        let loc = this.data;
        const access = keyPath.pop();
        for (var i = 0; i < keyPath.length; i++) {
            // Make missing path
            const exists =
                loc instanceof MoniteredStorage
                    ? loc.has(keyPath[i])
                    : keyPath[i] in loc;
            if (!exists) {
                if (loc instanceof MoniteredStorage) {
                    loc.set(keyPath[i], {});
                } else {
                    loc[keyPath[i]] = {};
                }
            }
            loc =
                loc instanceof MoniteredStorage
                    ? loc.get(keyPath[i])
                    : loc[keyPath[i]];
        }
        if (loc instanceof MoniteredStorage) {
            loc.set(access, value);
            if (loc.changed) {
                this.changed = true;
            }
        } else if (
            typeof loc[access] === "undefined" ||
            loc[access] !== value
        ) {
            this.changed = true;
            loc[access] = value;
        }
    }
}

if (typeof module !== "undefined") {
    module.exports = MoniteredStorage;
}
