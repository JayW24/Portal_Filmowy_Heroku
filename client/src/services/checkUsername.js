import axios from 'axios'

export default async function checkUsername(event, setUserNameCheck, setUserNameValidation) {
    if (event.target.value.length >= 5) {
        if (event.target.value.length >= 50) {
            setUserNameValidation(false)
            setUserNameCheck('That is definitely too long!')
        }
        else {
            const res = await axios(`/api/checkuserexistence/${event.target.value}`)
            if (res.data) {
                setUserNameValidation(false)
                setUserNameCheck('Username already exists! Choose different name!')
            }
            else {
                setUserNameValidation(true)
                setUserNameCheck(`Username available.`)
                //console.log('Username available.')
            }
        }

    }
    else {
        setUserNameValidation(false)
        if (event.target.value.length === 0) {
            setUserNameCheck("")
        }
        else {
            setUserNameCheck('Too short!')
        }
    }
}