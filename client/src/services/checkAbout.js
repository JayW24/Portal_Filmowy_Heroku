export default function checkAbout(event, setAboutCheck, setAboutValidation) {
    if (event.target.value.length <= 10) {
        setAboutCheck('Too short')
        setAboutValidation(false)
    }
    else if (event.target.value.length > 1) {
        if(event.target.value.length > 300) {
            setAboutCheck('Too long!')
            setAboutValidation(false)
        }
        else {
            setAboutCheck('✅')
            setAboutValidation(true)
        }

    }
    else {
        setAboutCheck('')
        setAboutValidation(false)
    }
    if (event.target.value.length == 0) {
        setAboutCheck('')
        setAboutValidation(false)
    }
}