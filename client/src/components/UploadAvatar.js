import { LoginContext } from "./LoginContext";
import React, { useState, useEffect, useContext } from "react";
import '../styles/UploadAvatar.css';
import uploadAvatar from '../services/uploadAvatar';
import saveFile from '../services/saveFile';
import checkMimeType from "../services/checkMimeType";
import checkFileSize from "../services/checkFileSize";

function UploadAvatar(props) {
    const loginIndicator = useContext(LoginContext);
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [fileFormatOk, setFileFormatOk] = useState(false);
    const [fileFormatMessage, setFileFormatMessage] = useState('');
    const [fileSizeOk, setFileSizeOk] = useState(null);
    const [fileSizeMessage, setFileSizeMessage] = useState('');
    const [newAvatarChosen, setNevAvatarChosen] = useState(null);

    useEffect(() => {
        fileSizeOk && fileFormatOk ? setButtonDisabled(false) : setButtonDisabled(true);
    }, [fileSizeOk, fileFormatOk])

    useEffect(() => {
        setFileFormatOk(false);
        setFileSizeOk(null);
        setFileFormatMessage('');
        setFileSizeMessage('');
        setNevAvatarChosen(null);
    }, [props.setNewPath])


    const onChangeHandler = (event) => {
        try {
            saveFile(event, setFile, setFileName);
            if (checkMimeType(event, setFileFormatOk, setFileFormatMessage) && checkFileSize(event, setFileSizeOk, setFileSizeMessage)) {
                setNevAvatarChosen(true);
            }
            else {
                alert("Wrong picture!");
                setNevAvatarChosen(null);
            }
        }
        catch (error) {
            alert('Upload avatar error!');
        }
    }

    let photoInfo = <>
        <p className="font-italic">Status: {fileFormatMessage} {fileSizeMessage}</p>
        <button onClick={event => { uploadAvatar(event, file, fileName, loginIndicator, props.setNewPath) }} disabled={buttonDisabled}>Zmień avatar</button>
    </>

    return (
        <div style={{ backgroundColor: "white" }} className="upload-avatar">
            <input className="btn" onChange={event => {onChangeHandler(event)}} type="file" />
            <br />
            {newAvatarChosen ? photoInfo : null}
        </div>
    )
}

export default UploadAvatar;
