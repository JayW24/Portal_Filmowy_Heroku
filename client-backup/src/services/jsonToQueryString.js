function jsonToQueryString(json) {
    let string = ''
    Object.keys(json).forEach((key, index) => {
        if (Object.keys(json).length > 1 && index !== 0) {
            string = string + "&" + `${key}=${json[key]}`
        }
        else {
            string = `${key}=${json[key]}`
        }
    })
    return string
}
export default jsonToQueryString