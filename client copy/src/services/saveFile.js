const saveFile = (e, setFile, setFileName) => {
    if (e.target.files[0].name) {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    }
}

export default saveFile