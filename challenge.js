const arr = [3, 7, 3, 2, 1, 5, 1, 2, 2, -2, 2, -2];

function findNumberOfBoomerangs(arr) {
    let boomerangsCounter = 0;
    for(let i=0; i< arr.length - 2; i++) {
        const first = arr[i];
        const third = arr[i+2];
        if(first === third) {
            boomerangsCounter += 1;
            i=i+2;
        }
    }
    console.log(boomerangsCounter);
}

findNumberOfBoomerangs(arr);