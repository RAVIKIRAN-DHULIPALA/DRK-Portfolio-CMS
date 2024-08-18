import { memo, useState, useEffect } from "react";
import styles from "./AddNewFiles.module.css";
import { ref, uploadBytesResumable, getDownloadURL, storage } from "../../Firebase-utils/config";
import { Fileuploadbase } from "../Inputs/Fileuploadbase";
import { LinearProgressWithLabel } from "../states/FileUpload";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { setFilesData } from "../../Firebase-utils/CallingMethods";

let transition = { type: "ease", ease: "easeInOut", duration: 0.4 };

const AddNewFiles = memo(({ onClose, accept, id }) => {
    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState(0);
    const [totalFiles, setTotalFiles] = useState(0);

    const [allUploadComplete, setAllUploadComplete] = useState(false);

    const handleFileChange = async (event) => {
        const filel = event.target.files;
        setAllUploadComplete(false)
        setFiles([...filel]);
        setTotalFiles(filel.length);

    }
    useEffect(() => {
        if (files.length > 0)
            handleUpload();
    }, [files])
    const handleUpload = async () => {
        const uploadPromises = files.map((file, index) => {
            const storageRef = ref(storage, `casestudycontent/${id}/` + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise(async (resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        switch (snapshot.state) {
                            case 'paused':

                                break;
                            case 'running':

                                break;
                        }
                    },
                    (error) => {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case 'storage/unauthorized':
                                // User doesn't have permission to access the object
                                break;
                            case 'storage/canceled':
                                // User canceled the upload
                                break;

                            // ...

                            case 'storage/unknown':
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                        }
                    },
                    async () => {
                        // Upload completed successfully, now we can get the download URL
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
                        setUploadedFiles((prevUploadedFiles) => prevUploadedFiles + 1);
                        var obj = {
                            file_name: file.name,
                            file_size: file.size,
                            file_type: file.type,
                            file_url: downloadUrl,
                            key: file.name.split('.')[0],
                        }
                        resolve(obj);

                    }
                );
            })

        })
        // Listen for state changes, errors, and completion of the upload.
        try {
            const data = await Promise.all(uploadPromises)
            setAllUploadComplete(true);
            const dt = objectFromArrayOfObjects(data);
            setFilesData(id, dt);
            setTimeout(() => {
                setAllUploadComplete(false);
                setFiles([]);
            }, 2500)





        } catch (err) {
            console.log(err)
        }
    }
    const objectFromArrayOfObjects = (array) => {
        const data = array.reduce((acc, obj) => {
            const { key } = obj;
            acc[key] = obj;
            return acc;
        }, {});
        return data;
    }
    const handleFiUpload = () => {
        const inputelement = document.getElementById("files");
        inputelement.click();
    }
    return (
        <MotionConfig transition={transition}>
            <div className={styles.addNewFiles}>
                <div className={styles.iconAndTitle}>
                    <img className={styles.featuredIcon} alt="" src="/assets/images/add-files-icon.svg" />
                    <h2 className={styles.title}>Add files</h2>
                    <button className={styles.button} onClick={onClose}>
                        <div className={styles.buttonBase}>
                            <img className={styles.icons} alt="" src="/assets/images/close.svg" />
                        </div>
                    </button>
                </div>
                <motion.div
                    animate={{ height: "auto" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                    style={{ width: "100%" }}
                >
                    <AnimatePresence mode="popLayout" >
                        {!allUploadComplete ?
                            <motion.div
                                style={{ width: "100%" }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    ...transition,
                                    duration: transition.duration / 2,

                                }}>
                                {files.length === 0 ?
                                    <Fileuploadbase name={"files"} id={"files"} accept={accept} multiple={true}
                                        handleFileChange={handleFileChange} handleUpload={handleFiUpload} text={"Upload files"} /> :
                                    <motion.div
                                        transition={{
                                            ...transition,
                                            duration: transition.duration / 2,
                                            delay: transition.duration / 2,
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}

                                        className={styles.noOfFilesUploaded}>
                                        <div className={styles.content}>
                                            <img
                                                className={styles.fileUploadIcon}
                                                alt=""
                                                src="/assets/images/upload-fe.svg"
                                            />
                                            <div className={styles.content1}>
                                                <div className={styles.textAndSupportingText}>
                                                    <h3
                                                        className={styles.text}
                                                    >Uploaded {uploadedFiles} out of {totalFiles}</h3>
                                                </div>
                                                <LinearProgressWithLabel value={(uploadedFiles / totalFiles) * 100} />
                                            </div>
                                        </div>
                                    </motion.div>
                                }
                            </motion.div> :
                            <motion.div
                                transition={{
                                    ...transition,
                                    duration: transition.duration / 2,
                                    delay: transition.duration / 2,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }} className={styles.allItemsUploaded}>
                                <img className={styles.checkIcon} alt="" src="/assets/images/uploaded icon.svg" />
                                <div className={styles.textWrap}>
                                    <p className={styles.text1}>{totalFiles} are uploaded</p>
                                </div>
                            </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>
            </div>
        </MotionConfig>
    );
});

export default AddNewFiles;
