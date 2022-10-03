export default function ConvertDate(number) {
    const   date = new Date(number),
            year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDay(),
            hour = date.getHours(),
            minutes = date.getMinutes()

    let dateObj = { month: month, day: day, hour: hour, minutes: minutes }

    for (let key in dateObj) {
        if (dateObj[key] < 10) {
            dateObj[key] = `0${dateObj[key]}`
        }
        else {
            dateObj[key] = `${dateObj[key]}`
        }
    }
    return `${dateObj['hour']}:${dateObj['minutes']} ${dateObj['day']}-${dateObj['month']}-${year}`
}