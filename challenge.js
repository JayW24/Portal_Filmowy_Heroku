function Cat() {
    this.this1 = function() {
        console.log(this);
        const this2 = function() {
            console.log(this);
        }
        this2();
        const this3 = () => {
            console.log(this);
        }
        this3();
    }
    this.this4 = () => {
        console.log(this);
    }
    this.this5 = {
        this5: function() {
            console.log(this)
        }
    }
}

const mirek = new Cat();
mirek.this5.this5();