function Base(name) {
    this.name = name;
}
function Child(name) {
    Base.call(this, name);
}
Child.prototype = new Base();
Base.prototype.getName = function () {
    return 'Hello ' + this.name;
}
var base = new Base('Java');
var child = new Child('Java8');
console.log(base.getName());
console.log(child.getName());
