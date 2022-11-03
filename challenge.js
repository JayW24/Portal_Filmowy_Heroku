function x(a,b) {
    this.a = a;
    this.b = b;
}

x.prototype.sum = function() {return this.a + this.b}

function y(a, b) {
    Object.setPrototypeOf(this, new x(a, b))
}

let xx = new y(2,2)
console.log(xx.sum())