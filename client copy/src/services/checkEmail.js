import axios from 'axios'

export default async function checkEmail(event, setEmailCheck, setEmailValidation) {
    const value = event.target.value,
    re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const isEmail = re.test(String(value).toLowerCase())
    if (isEmail) {
        if (value.length >= 5) {
            const res = await axios(`/api/checkemailexistence/${value}`)
            if (res.data) {
                setEmailCheck('Email already exists! Choose different name!')
                setEmailValidation(false)
            }
            else {
                setEmailCheck(`Email: ${value} is available.`)
                setEmailValidation(true)
            }
        }
        else {
            setEmailCheck('Too short!')
            setEmailValidation(false)
        }
    }
    else {
        if (value == '') {
            setEmailCheck('')
            setEmailValidation(false)
        }
        else {
            setEmailCheck('This is not email adress.')
            setEmailValidation(false)
        }
    }
}