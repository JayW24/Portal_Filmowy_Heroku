export default function checkFrom(event, setFromCheck, setFromValidation) {
    if (event.target.value.length <= 1) {
        setFromCheck('Too short')
        setFromValidation(false)
    }
    else if (event.target.value.length > 1) {
        if(event.target.value.length > 100) {
            setFromCheck('Too long.')
            setFromValidation(false)
        }
        else {
            setFromCheck('✅')
            setFromValidation(true)
        }

    }
    else {
        setFromCheck('')
        setFromValidation(false)
    }
    if (event.target.value.length === 0) {
        setFromCheck('')
        setFromValidation(false)
    }
}