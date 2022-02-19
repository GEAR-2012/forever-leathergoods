import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AppState } from "../context/app-context";

const useStorage = (file) => {
  const { storageFolder } = AppState();

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const [name, setName] = useState("");

  // make unique filename
  const uuid = uuidv4();
  const fileName = file.name.replace(/\.[^/.]+$/, "") + "---" + uuid;
  console.log(storageFolder);
  //

  // references
  const storageRef = ref(storage, storageFolder + "/" + fileName);

  // upload file
  useEffect(() => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percentage);
      },
      (error) => {
        setError(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setName(fileName);
        setUrl(url);
      }
    );
  }, [file, fileName, storageRef]);

  return { progress, error, url, name };
};

export default useStorage;
