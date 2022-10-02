const checkMimeType = (event, setFileFormatOk, setFileFormatMessage) => {
    let files = event.target.files
    let err = ''
    const types = ['image/png', 'image/jpeg']
    if (types.every(type => files[0].type !== type)) {
        err += files[0].type + ' is not a supported format\n';
        setFileFormatOk(false)
        setFileFormatMessage('Wrong image format.')
    }
    else {
        setFileFormatMessage('File format is correct.')
        setFileFormatOk(true)
    }
    if (err !== '') { // if message not same old that mean has error 
        event.target.value = null // discard selected file
        setFileFormatOk(false)
        setFileFormatMessage(err)
        console.log(err)
        return false;
    }
    return true;
}

export default checkMimeType