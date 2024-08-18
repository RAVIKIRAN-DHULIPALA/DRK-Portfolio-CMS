import { ThumbnailContent } from './ThumbnailContent';
import { ActionsFooter } from './ActionsFooter';
import { SlideoutHeader } from './SlideoutHeader';
import { Fileuploadbase } from '../Inputs/Fileuploadbase';
import { Fragment, memo, useEffect, useLayoutEffect, useState } from "react";
import styles from "./AddNew.module.css";
import InputComponent from "../Inputs/InputComponent";
import { FormControlLabel } from "@mui/material";
import { IOSSwitch } from "../Inputs/IOSSwitch";
import { useForm } from "react-hook-form";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, storage } from "../../Firebase-utils/config";
import FileUpload from "../states/FileUpload";
import { AddData, removethumbnail } from "../../Firebase-utils/CallingMethods";

const AddNew = memo(({ onClose, title, label, type, docName, containerName }) => {
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
    let casePostFields = {
        referenceTitle: "",
        title: "",
        slug: "",
        category: "",
        order: -1,
        thumbnail_url: "",
        thumbnailName: "",
        show: true,
        isAvailable: false,
    };
    let writingFields = {
        referenceTitle: "",
        title: "",
        slug: "",
        order: -1,
        thumbnail_url: "",
        thumbnailName: "",
        show: true,
        isAvailable: false,
    }
    let designFields = {
        thumbnail_url: "",
        thumbnailName: "",
        show: true,
        key: "",
        isAvailable: false,
    }
    let faqFields = {
        answer: "",
        order: -1,
        question: "",
    }
    const [formFields, setFormFields] = useState([]);
    useEffect(() => {
        if (type === "casestudy" || type === "post")
            setFormFields([casePostFields]);
        else if (type === "writing")
            setFormFields([writingFields])
        else if (type === "designs")
            setFormFields([designFields])
        else
            setFormFields([faqFields])
    }, [])
    const addFields = () => {
        let object = (type === "casestudy" || type === "post") ? casePostFields : type === "writing" ? writingFields : type === "desings" ? designFields : faqFields;

        setFormFields([...formFields, object]);
    };
    const handleFormChange = (event, index, type) => {
        let data = [...formFields];
        if (type === "switch") {
            data[index][event.target.name] = event.target.checked;
        }
        else {
            data[index][event.target.name] = event.target.value;
        }
        setFormFields(data);
    };
    const [file, setFile] = useState("");

    const handleFileChange = (event, index) => {
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
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    let data = [...formFields];
                    data[index][event.target.name] = downloadURL;
                    data[index]["thumbnailName"] = filel.name;
                    if (type === "designs") {
                        data[index]["key"] = filel.name.split(".")[0];
                        if (filel.type === "video/mp4" || filel.type === "video/webm") {
                            data[index]["video"] = true;
                        }
                    }

                    setFormFields(data)
                    setFile("")
                });
            }
        );
    }
    const [progress, setProgress] = useState(0);

    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1);
        setFormFields(data);
    };
    const submit = () => {
        AddData(docName, formFields)
        onClose();
    }
    return (
        <div className={styles.addNewCaseStudiesSlideOut} data-animate-on-scroll>
            <SlideoutHeader onClose={onClose} type={title} />
            <form method="post" className={styles.mainForm} onSubmit={handleSubmit(submit)}>
                <div className={styles.mainFormContent}>
                    {formFields.length && formFields.map((form, index) => {
                        return (
                            <Fragment key={index}>
                                {(type !== "designs" && type !== "faq") && <><InputComponent
                                    isLabel={true}
                                    label="Referring title (only for reference)"
                                    type="text"
                                    placeholder="Enter reference title"
                                    name="referenceTitle"
                                    value={form.referenceTitle}
                                    index={index}
                                    change={handleFormChange}
                                />
                                    <InputComponent
                                        isLabel={true}
                                        label={`${label} title`}
                                        type="text"
                                        placeholder={`Enter ${label} title`}
                                        name="title"
                                        value={form.title}
                                        index={index}
                                        change={handleFormChange}
                                    />
                                    <InputComponent
                                        isLabel={true}
                                        label="Slug"
                                        type="text"
                                        placeholder="Enter slug"
                                        name="slug"
                                        value={form.slug}
                                        index={index}
                                        change={handleFormChange}
                                    />
                                </>
                                }
                                {
                                    type === "faq" && <>
                                        <InputComponent
                                            isLabel={true}
                                            label={`Faq question ${index + 1}`}
                                            type="text"
                                            placeholder={`Enter Faq question ${index + 1}`}
                                            name="question"
                                            value={form.question}
                                            index={index}
                                            change={handleFormChange}
                                        />
                                        <InputComponent
                                            isLabel={true}
                                            label="Answer"
                                            type="text"
                                            placeholder="Enter answer"
                                            name="answer"
                                            value={form.answer}
                                            index={index}
                                            change={handleFormChange}
                                        />
                                    </>
                                }
                                {(type === "casestudy" || type === "post") &&
                                    <InputComponent
                                        isLabel={true}
                                        label="Category"
                                        type="text"
                                        placeholder="Enter category"
                                        name="category"
                                        value={form.category}
                                        index={index}
                                        change={handleFormChange}
                                    />}
                                {type !== "designs" && <InputComponent
                                    isLabel={true}
                                    label="Order"
                                    type="number"
                                    placeholder="Enter order to be displayed"
                                    name="order"
                                    value={form.order === -1 ? "" : form.order}
                                    index={index}
                                    change={handleFormChange}
                                />}
                                {type !== "faq" && <div className={styles.thumbnail}>
                                    <div className={styles.label}>Thumbnail</div>
                                    {form.thumbnail_url !== "" ?
                                        <ThumbnailContent removethumbnail={removethumbnail} index={index} url={formFields[index]?.thumbnail_url} formFields={formFields} setFormFields={setFormFields} file={file} setFile={setFile} attributeName={"thumbnail_url"} docName={containerName} /> :
                                        file === "" ?
                                            <Fileuploadbase handleUpload={handleUpload} name={"thumbnail_url"} handleFileChange={handleFileChange} index={index} text="Upload thumbnail" id="thumbnail_upload" accept={type === "designs" ? "video/*,image/*" : "image/*"} />
                                            : <FileUpload progress={progress} name={file.name} size={file.size} />
                                    }
                                </div>}
                                {type !== "faq" && <><FormControlLabel
                                    className={styles.showCaseStudy} control={<IOSSwitch name="show" checked={form.show} index={index} onChange={(event) => { handleFormChange(event, index, "switch") }} />} label={`Show ${label}`} />
                                    <FormControlLabel
                                        className={styles.showCaseStudy} control={<IOSSwitch name="isAvailable" checked={form.isAvailable} index={index} onChange={(event) => { handleFormChange(event, index, "switch") }} />} label={`Is ${label} available`} />
                                    <div className={styles.divider1} />
                                </>}
                            </Fragment>)
                    })}
                    <button className={styles.addMore} onClick={addFields} type="button">
                        <div className={styles.addMoreButton}>
                            <img className={styles.xIcon} alt="" src="/assets/images/add-more.svg" />
                            <div className={styles.addMore1}>Add more</div>
                        </div>
                    </button>
                </div>
                <ActionsFooter onClose={onClose} action={() => { }} />
            </form >
        </div >
    );
});

export default AddNew;
