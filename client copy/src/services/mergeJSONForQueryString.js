function mergeJSONForQueryString(json1, json2) {
    if(Object.keys(json1).length > 0) {
        Object.keys(json1).forEach(function(key) {
            Object.keys(json2).forEach(function(key2) {
                if(key == key2) {
                    json1[key] = json2[key2]
                }
                if(!json1.hasOwnProperty(key2) && json2[key2]) {
                    json1[key2] = json2[key2]
                }
            })
        })
    }
    else {
        json1 = json2
    }
    Object.keys(json1).forEach(key => {
        !json1[key] && delete json1[key]
    })
    return json1
}


export default mergeJSONForQueryString