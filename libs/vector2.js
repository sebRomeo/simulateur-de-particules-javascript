function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.sub = function (a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
};

Vector.add = function (a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
};
Vector.scale = function (v, s) {
    return new Vector(v.x, v.y).scale(s);
};
Vector.invert = function (v) {
    return new Vector(0 - v.x, 0 - v.y)
};
Vector.speed = function (v) {
    return Math.hypot(v.x, v.y)
}
Vector.prototype = {
    set: function (x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.x = x || 0;
        this.y = y || 0;
        return this;
    },

    add: function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    sub: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    scale: function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    },

    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    lengthSq: function () {
        return this.x * this.x + this.y * this.y;
    },
    normalize: function () {
        var m = Math.sqrt(this.x * this.x + this.y * this.y);
        if (m) {
            this.x /= m;
            this.y /= m;
        }
        return this;
    },

    angle: function () {
        return Math.atan2(this.y, this.x);
    },

    angleTo: function (v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.atan2(dy, dx);
    },

    distanceTo: function (v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceToSq: function (v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return dx * dx + dy * dy;
    },

    lerp: function (v, t) {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    },

    clone: function () {
        return new Vector(this.x, this.y);
    },

    toString: function () {
        return '(x:' + this.x + ', y:' + this.y + ')';
    }
};
