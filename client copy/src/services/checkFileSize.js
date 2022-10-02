const checkFileSize = (event, setFileSizeOk, setFileSizeMessage) => {
    let files = event.target.files
    let size = 1000000 // file size limit = 1MB
    let err = "";
    if (files[0].size > size) {
        err += files[0].type + 'is too large, please pick a smaller file\n'
        setFileSizeOk(false)
        setFileSizeMessage('File is too large!')

    }
    else {
        console.log('File size is OK!')
        setFileSizeOk(true)
        setFileSizeMessage('File size is OK!')
    }
    if (err !== '') {
        event.target.value = null
        setFileSizeOk(false)
        console.log(err)
        return false
    }
    return true;
}

export default checkFileSize