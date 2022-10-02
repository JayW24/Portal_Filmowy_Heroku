import axios from 'axios'

const uploadFile = async (event, file, fileName, loginIndicator) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    try {
        const res = await axios.post(
            `/api/uploadavatar/${loginIndicator}`,
            formData
        );
        alert(res.statusText)
    } catch (err) {
        alert(err)
    }
}

export default uploadFile