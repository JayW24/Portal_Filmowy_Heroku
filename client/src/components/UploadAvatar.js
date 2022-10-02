import { LoginContext } from "./LoginContext";
import React, { useState, useEffect, useContext } from "react";
import '../styles/UploadAvatar.css'
import uploadFile from '../services/uploadFile'
import saveFile from '../services/saveFile'
import checkMimeType from "../services/checkMimeType";
import checkFileSize from "../services/checkFileSize";

function UploadAvatar(props) {
    const loginIndicator = useContext(LoginContext),
        [file, setFile] = useState(""),
        [fileName, setFileName] = useState(null),
        [buttonDisabled, setButtonDisabled] = useState(true),
        [fileFormatOk, setFileFormatOk] = useState(false),
        [fileFormatMessage, setFileFormatMessage] = useState(''),
        [fileSizeOk, setFileSizeOk] = useState(null),
        [fileSizeMessage, setFileSizeMessage] = useState(''),
        [newAvatarChosen, setNevAvatarChosen] = useState(null)

    useEffect(() => {
        fileSizeOk && fileFormatOk ? setButtonDisabled(false) : setButtonDisabled(true)
    })


    const onChangeHandler = (event) => {
        try {
            saveFile(event, setFile, setFileName)
            if (checkMimeType(event, setFileFormatOk, setFileFormatMessage) && checkFileSize(event, setFileSizeOk, setFileSizeMessage)) {
                setNevAvatarChosen(true)
            }
            else {
                alert("Wrong picture!")
                setNevAvatarChosen(null)
            }
        }
        catch (error) {
            alert('Upload avatar error!')
        }
    }

    let photoInfo = <>
        {fileSizeOk ? "File size OK." : "Too big file!"} <br />
        fileFormatOk: {fileFormatOk.toString()} <br />
        fileStatusMessage: {fileFormatMessage} {fileSizeMessage}
        <button onClick={event => { uploadFile(event, file, fileName, loginIndicator) }} disabled={buttonDisabled}>Zmień avatar</button>
    </>

    return (
        <div style={{ backgroundColor: "white" }} className="upload-avatar">
            <input className="btn" onChange={event => {
                onChangeHandler(event)
            }} type="file" /> <br />
            {newAvatarChosen ? photoInfo : null}
        </div>
    )
}

export default UploadAvatar;
