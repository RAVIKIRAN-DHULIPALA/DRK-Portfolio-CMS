import { ReplaceThumbnailContent } from './ReplaceThumbnailContent';
import { ActionsFooter } from './ActionsFooter';
import { SlideoutHeader } from './SlideoutHeader';
import { Fragment, memo, useEffect, useState } from "react";
import styles from "./Edit.module.css";
import InputComponent from "../Inputs/InputComponent";
import { FormControlLabel } from "@mui/material";
import { IOSSwitch } from "../Inputs/IOSSwitch";
import { useForm } from "react-hook-form";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "../../Firebase-utils/config";
import FileUpload from "../states/FileUpload";
import { Fileuploadbase } from '../Inputs/Fileuploadbase';
import { storage } from "../../Firebase-utils/config";
import { UpdateData, getParticularData, removethumbnail, replaceThumbnail } from "../../Firebase-utils/CallingMethods";

const Edit = memo(({ onClose, slug, containerName, docName, title, label, type }) => {
    useEffect(() => {
        const scrollAnimElements = document.querySelectorAll(
            "[data-animate-on-scroll]"
        );
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting || entry.intersectionRatio > 0) {
                        const targetElement = entry.target;
                        targetElement.classList.add(styles.animate);
                        observer.unobserve(targetElement);
                    }
                }
            },
            {
                threshold: 0.15,
            }
        );

        for (let i = 0; i < scrollAnimElements.length; i++) {
            observer.observe(scrollAnimElements[i]);
        }

        return () => {
            for (let i = 0; i < scrollAnimElements.length; i++) {
                observer.unobserve(scrollAnimElements[i]);
            }
        };
    }, []);
    // const storage = getStorage(app);

    const handleUpload = () => {
        const inputelement = document.getElementById("thumbnail_upload");
        inputelement.click();
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [formFields, setFormFields] = useState({});
    useEffect(() => {
        getParticularData(docName, slug, setFormFields, type);
    }, [])

    const handleFormChange = (event, type) => {
        let data = { ...formFields };
        if (type === "switch") {
            data[event.target.name] = event.target.checked;
        }
        else {
            data[event.target.name] = event.target.value;
        }
        setFormFields(data);
    };
    const [file, setFile] = useState("");

    const handleFileChange = (event) => {
        const filel = event.target.files[0];
        setFile(filel);
        const storageRef = ref(storage, `${containerName}/` + filel.name);
        const uploadTask = uploadBytesResumable(storageRef, filel);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100 | 0);

                setProgress(progress)
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
                        console.log(error.message)
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        console.log(error.message)
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        console.log(error.message)
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    let data = { ...formFields };
                    data[event.target.name] = downloadURL;
                    data["thumbnailName"] = filel.name;
                    setFormFields(data)
                    setFile("");
                    setProgress(0)
                });
            }
        );
    }
    const [progress, setProgress] = useState(0);

    const submit = () => {
        UpdateData(docName, formFields, slug, type)
        onClose();
    }
    return (
        <div className={styles.addNewCaseStudiesSlideOut} data-animate-on-scroll>
            <SlideoutHeader onClose={onClose} type={formFields.referenceTitle} isEdit={true} content={type === "casestudy" ? `/${formFields.slug}` : type === "post" ? formFields.category : formFields.referenceTitle} />
            <form method="post" className={styles.mainForm} onSubmit={handleSubmit(submit)}>
                <div className={styles.mainFormContent}>
                    {type === "faq" ? <InputComponent
                        isLabel={true}
                        label="Order"
                        type="number"
                        placeholder="Enter order to be displayed"
                        name="order"
                        value={formFields.order}
                        change={handleFormChange}
                    /> : <>
                        {type !== "writing" && <InputComponent
                            isLabel={true}
                            label="Referring title (only for reference)"
                            type="text"
                            placeholder="Enter reference title"
                            name="referenceTitle"
                            value={formFields.referenceTitle || ""}
                            change={(event) => handleFormChange(event)}
                        />}
                        <InputComponent
                            isLabel={true}
                            label={`${type} title`}
                            type="text"
                            placeholder={`Enter ${type} title`}
                            name="title"
                            value={formFields.title || ""}
                            change={handleFormChange}
                        />
                        {(type === "casestudy") && <InputComponent
                            isLabel={true}
                            label="Category"
                            type="text"
                            placeholder="Enter category"
                            name="category"
                            value={formFields.category || ""}
                            change={handleFormChange}
                        />}
                        {type !== "casestudy" && <InputComponent
                            isLabel={true}
                            label="Slug"
                            type="text"
                            placeholder="Enter slug"
                            name="slug"
                            value={formFields.slug || ""}
                            change={handleFormChange}
                        />}
                        <InputComponent
                            isLabel={true}
                            label="Order"
                            type="number"
                            placeholder="Enter order to be displayed"
                            name="order"
                            value={formFields.order}
                            change={handleFormChange}
                        />
                        <div className={styles.thumbnail}>
                            <div className={styles.label}>Thumbnail</div>
                            {formFields.thumbnail_url !== "" ?
                                <ReplaceThumbnailContent replaceThumbnail={replaceThumbnail} formFields={formFields} setFormFields={setFormFields} containerName={containerName} /> :
                                file === "" ?
                                    <Fileuploadbase handleUpload={handleUpload} name={"thumbnail_url"} event={event} handleFileChange={handleFileChange} text="Upload thumbnail" id="thumbnail_upload" accept="image/*" />
                                    : <FileUpload progress={progress} name={file.name} size={file.size} />
                            }
                        </div>
                        <FormControlLabel
                            className={styles.showCaseStudy} control={<IOSSwitch name="show" checked={formFields.show || false} onChange={(event) => { handleFormChange(event, "switch") }} />} label="Show case study" />
                        <FormControlLabel
                            className={styles.showCaseStudy} control={<IOSSwitch name="isAvailable" checked={formFields.isAvailable || false} onChange={(event) => { handleFormChange(event, "switch") }} />} label="Is casestudy available" />
                        <hr />
                    </>}
                </div>
                <ActionsFooter onClose={onClose} />
            </form >
        </div >
    );
});

export default Edit;
