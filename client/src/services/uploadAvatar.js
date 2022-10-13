import axios from 'axios'

const uploadAvatar = async (event, file, fileName, loginIndicator, setNewPath) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    try {
        const res = await axios.post(
            `/api/uploadavatar/${loginIndicator}`,
            formData
        );
        setNewPath(res.data.newAvatarPath);
    } catch (err) {
        alert(err)
    }
}

export default uploadAvatar;