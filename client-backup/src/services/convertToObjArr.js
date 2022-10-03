export default function convertToObjArr(string) {
    let arr = string.split(" | ")
    arr = arr.map(el => el.replace('(', ''))
    arr = arr.map(el => el.replace(')', ''))
    arr = arr.map(el => el.split(';'))
    let objArr = []
    arr.forEach(el => {
        el = {name: el[0], url: el[1]}
        objArr.push(el)
    })
    return objArr
}