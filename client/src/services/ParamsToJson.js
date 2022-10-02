//categories=cat3&name=Film  => {"categories":"cat3","name":"Film"}

function ParamsToJson(paramsString){
    let jsonArr = paramsString.split('&').map(el => el.split('=')).map(el => `{"${el[0]}" : "${el[1]}"}`).map(el => JSON.parse(el))
    let json = {}
    jsonArr.forEach((el, i) => {
        json[(Object.keys(el)[0])] = Object.values(el)[0]
    })
    return json
}
export default ParamsToJson