import axios from 'axios'

export default async function handleDateOfBirthChange(event, setDateOfBirth, setDateOfBirthCheck, setDateOfBirthValidation) {
    let dateVal = new Date(event.target.value)
    let dateValTime = dateVal.getTime()
    setDateOfBirth({ [event.target.name]: dateValTime })
    let currentDate = await axios('/api/servertime')
    let currentYear = new Date(parseInt(currentDate.data))
    currentYear = currentYear.getFullYear()
    let userYear = dateVal.getFullYear()
    if (currentYear <= userYear + 2) {                   //user has to be older than 2 years old
        setDateOfBirthCheck('Wrong date.')
        setDateOfBirthValidation(false)
    }
    else {
        setDateOfBirthCheck('Good. Correct date.')
        setDateOfBirthValidation(true)
    }
}