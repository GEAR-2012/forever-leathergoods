import { useEffect, useState } from "react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage, timestamp } from "../firebase/config";
import { AppState } from "../context/app-context";

// upload one picture at the time function
const uploadPicture = (folder, fileObj, setProgressArr, index, docId, setAlert) => {
  // get file object & file name from 'fileObj'
  const file = fileObj.file;
  const fileName = fileObj.name;

  // References
  const storageRef = ref(storage, `${folder}/${fileName}`);
  const docRef = doc(db, folder, docId);

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      setProgressArr((prevState) => {
        const newState = [...prevState];
        newState[index] = progress;
        return newState;
      });
    },
    (error) => {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const urlObj = { name: fileName, url: downloadURL };
        updateDoc(docRef, { pictureList: arrayUnion(urlObj), updatedAt: timestamp() });
      });
    }
  );
};

const useUploadPictures = (folderName, fileListArr, docId) => {
  const { progress: uploadProgress, setProgress, setAlert } = AppState();
  const [fileCount, setFileCount] = useState(0);
  const [progressArr, setProgressArr] = useState([]);

  // gets the length of the 'fileListArr' & set it into a local state
  // & clean up fn resets the progress array
  useEffect(() => {
    // resetStates();
    if (fileListArr) {
      setFileCount(fileListArr.length);
    }
    return () => {
      setProgressArr([]);
    };
  }, [fileListArr]);

  // call picture uploader fn multiple times if necessary
  useEffect(() => {
    if (fileListArr && folderName) {
      fileListArr.forEach((fileObj, index) => {
        uploadPicture(folderName, fileObj, setProgressArr, index, docId, setAlert);
      });
    }
  }, [fileListArr, folderName, docId, setAlert]);

  // calculate total progress & set into app state
  useEffect(() => {
    if (fileCount) {
      const progress = progressArr.reduce((a, b) => {
        return a + b;
      }, 0);
      setProgress(progress / fileCount);
    }
  }, [progressArr, fileCount, setProgress]);

  // when the progress reaches the 100%
  useEffect(() => {
    if (uploadProgress === 100) {
      setAlert({
        open: true,
        message: "Pictures are uploaded",
        type: "success",
      });
    }
  }, [uploadProgress, setAlert]);
};

export default useUploadPictures;
