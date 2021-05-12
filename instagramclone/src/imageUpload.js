import { Button } from '@material-ui/core';
import { db, storage } from "./firebase"
import React,{ useState }  from 'react'
import firebase from "firebase";
import './ImageUpload.css'
import axios from './axios';

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function..
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //error function...
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    setUrl(url);

                    axios.post('/upload', {
                        caption: caption,
                        user: username,
                        image: url
                    });

                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        );
    }

    return (
        <div className="imageupload">
            <progress className="imageupload__Progress" value={progress} max="100" />          
            <input className="imageupload__Caption" type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
            <input className="imageupload__File" type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
