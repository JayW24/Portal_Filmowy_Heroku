export default function checkPassword(event, setPasswordCheck, setPasswordValidation) {
    const specials = [".", "\\", ":", ";", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "`", "*"]
    if (event.target.value == "" || event.target.value == null) {
        setPasswordCheck(null)
    }
    else {
        if (event.target.value.length < 7) {
            setPasswordCheck('Too short!')
        }
        else {
            if (event.target.value.length > 50) {
                setPasswordCheck('Too long.')
            }
            else {
                let includesSpecial = false
                specials.forEach(el => {
                    if ((event.target.value).includes(el)) {
                        includesSpecial = true;
                        setPasswordCheck('✅')
                    }
                    else {
                        if (includesSpecial) {
                            setPasswordCheck('✅')
                            setPasswordValidation(true)
                        }
                        else {
                            console.log(event.target.value)
                            setPasswordCheck('Password should include at least one special character or number!')
                            setPasswordValidation(false)
                        }
                    }
                })
            }
        }
    }

}


