import { useState, useCallback, memo, useEffect, useRef } from "react";
import styles from "./ManageCasestudyContent.module.css";
import { Divider } from "@mui/material";
import Editor from "@monaco-editor/react";
import InputComponent from "../../../Components/Inputs/InputComponent";
import { Fileuploadbase } from "../../../Components/Inputs/Fileuploadbase";
import FileUpload from "../../../Components/states/FileUpload";
import PageHeader from "../../../Components/MainLayout-blue/PageHeader";
import { debounce } from '@mui/material';
import PortalDrawer from "../../../Components/Navigation/PortalDrawer";
import AIHelper from "../../../Components/ItemComponents/AIHelper";
import Autocomplete from '@mui/material/Autocomplete';
import { storage, ref, uploadBytesResumable, getDownloadURL } from "../../../Firebase-utils/config";
import { getOrderedData, removecssMockupfile, updatecasestudyContent } from "../../../Firebase-utils/CallingMethods";


const ManageCaseStudies = memo(({ slug, fromnav, fromsec, data }) => {

    const [state, SetState] = useState("synced");
    const [formdata, setFormData] = useState({});
    const [continuedata, setContinuedata] = useState([]);
    const [cssprogress, setCssProgress] = useState(0);
    const [mockupprogress, setMockupProgress] = useState(0);
    const [cssfile, setcssFile] = useState("");
    const [mockupfile, setMockupFile] = useState("");
    const [isAIHelperOpen, setAIHelperOpen] = useState(false);

    const openAIHelper = useCallback(() => {
        setAIHelperOpen(true);
    }, []);

    const closeAIHelper = useCallback(() => {
        setAIHelperOpen(false);
    }, []);

    useEffect(() => {
        setFormData(data)
        setcssFile(data?.cssName)
        setMockupFile(data?.imgName);
    }, [data])
    useEffect(() => {
        const unsubscribe = getOrderedData("UX case studies", setContinuedata, "contents");
        return () => unsubscribe();
    }, [])

    //normal input change handler
    const handleFormInputChange = (event) => {
        SetState("modified");
        let data = { ...formdata };
        data[event.target.name] = event.target.value;
        setFormData(data)
    }

    //format the html content in editor on mounting
    const handleEditorMount = (editor) => {
        setTimeout(function () {
            editor
                .getAction('editor.action.formatDocument')
                .run()
        }, 100);
    };

    //get the editor changed html value
    const handleEditorChange = (value, event) => {
        SetState("modified");
        let data = { ...formdata };
        data["html"] = value;
        setFormData(data)
    }

    // handle tob inputs changes
    const handleTobChange = (event, index) => {
        SetState("modified");
        let data = { ...formdata };
        data["TOB"][index][event.target.name] = event.target.value;
        setFormData(data);
    }
    const addmoreTOB = () => {
        SetState("modified");
        let dt = { name: "", linkTo: "" }
        var d = { ...formdata };
        d["TOB"] = [...d["TOB"], dt];
        setFormData(d);
    }

    const removeTOB = (index) => {
        SetState("modified");
        let data = { ...formdata };
        data["TOB"].splice(index, 1);
        setFormData(data);
    }

    //handle continue data
    const handleContinue = (value) => {
        SetState("modified");
        let data = { ...formdata };
        data["continue"] = value;
        setFormData(data);
    }

    const debounceSave = useCallback(debounce((data) => {
        //update data into Firebase
        updatecasestudyContent(slug, data, SetState);
    }, 1000), []);

    useEffect(() => {
        if (state === "modified") {
            debounceSave(formdata)
        }

    }, [debounceSave, formdata, state]);

    const handlecssUpload = () => {
        const inputelement = document.getElementById("file_css");
        inputelement.click();
    }

    const fileHandle = (event, setFile, setProgress, type, typename) => {
        const filel = event.target.files[0];
        setFile(filel.name);
        const storageRef = ref(storage, `casestudycontent/${slug}/` + filel.name);
        const uploadTask = uploadBytesResumable(storageRef, filel);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100 | 0);

                setProgress(progress);
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
                    let data = { ...formdata };
                    SetState("modified");
                    data[type] = downloadURL;
                    data[typename] = filel.name;
                    setFormData(data)
                    if (type === "img")
                        setFile("")
                });
            }
        );
    }
    const handleThumbnailUpload = () => {
        const inputelement = document.getElementById("mockup_image");
        inputelement.click();
    }
    return (
        <form className={styles.manageForm}>
            <PageHeader title={`/${slug}`}
                isManage={true}
                category={formdata?.category || ""}
                fromsec={fromsec}
                state={state}
                fromnav={fromnav} />
            <div className={styles.formContent}>
                <div className={styles.title}>
                    <div className={styles.label}>Title</div>
                    <div className={styles.inputContainer}>
                        <InputComponent
                            name="title" isLabel={false}
                            placeholder={"Enter your Title here"}
                            value={formdata?.title || ""}
                            change={(event) => handleFormInputChange(event)} />
                    </div>
                </div>
                <Divider />
                <div className={styles.title}>
                    <div className={styles.label1}>Tab/page title</div>
                    <div className={styles.inputContainer}>
                        <InputComponent name="pageTitle"
                            isLabel={false}
                            placeholder={"Enter your page title here"}
                            value={formdata?.pageTitle || ""}
                            change={(event) => handleFormInputChange(event)} />
                    </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.title}>
                    <div className={styles.label1}>Description</div>
                    <div className={styles.inputContainerai}>
                        <InputComponent name="desp" type={"multiline"}
                            value={formdata?.desp || ""}
                            change={(event) => handleFormInputChange(event)}
                            placeholder={"Enter your description"} isLabel={false} />
                        <button className={styles.buttonBase} type="button" onClick={() => { openAIHelper(); }} >
                            <img
                                className={styles.logOutIcon}
                                alt=""
                                src="/assets/images/ai.svg"
                            />
                            <div className={styles.ai}>Get AI helper</div>
                        </button>
                    </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.title}>
                    <div className={styles.label1}>HTML content</div>
                    <Editor
                        className={styles.inputContainer2}
                        theme="vs-light"
                        language="html"
                        name="html"
                        value={formdata?.html || ""}
                        onChange={handleEditorChange}
                        onMount={handleEditorMount}
                        options={{
                            inlineSuggest: true,
                            fontSize: "16px",
                            formatOnType: true,
                            formatOnPaste: true,
                            colorDecorators: true,
                            contextmenu: true,
                            cursorBlinking: "blink",
                            codeLens: false,
                            autoClosingBrackets: true,

                        }}
                    />
                </div>
                <div className={styles.divider} />
                <div className={styles.title}>
                    <div className={styles.label1}>CSS file</div>
                    <div className={styles.inputContainer}>
                        {cssfile === "" ? <Fileuploadbase handleUpload={handlecssUpload} text="Upload css file" id="file_css" name="css" accept="text/css" handleFileChange={(event) => { fileHandle(event, setcssFile, setCssProgress, "css", "cssName") }} />
                            : <FileUpload deleteFunction={() => { SetState("modified"); removecssMockupfile(slug, formdata, setFormData, cssfile, setcssFile, "css", "cssName") }} progress={cssprogress} name={cssfile} size={"text/css"} isUploaded={formdata?.css !== "" ? true : false} />}
                    </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.title}>
                    <div className={styles.label1}>Fonts</div>
                    <div className={styles.fontLinks}>
                        <div className={styles.linkTo}>
                            <div className={styles.text15}>Font 1 link</div>
                            <div className={styles.inputContainer3}>
                                <InputComponent name="font1"
                                    value={formdata?.font1 || ""}
                                    change={(event) => handleFormInputChange(event)}
                                    isLabel={false} />
                            </div>
                        </div>
                        <div className={styles.linkTo}>
                            <div className={styles.text15}>Font 2 link</div>
                            <div className={styles.inputContainer3}>
                                <InputComponent name="font2"
                                    value={formdata?.font2 || ""}
                                    change={(event) => handleFormInputChange(event)}
                                    isLabel={false} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.title}>
                    <div className={styles.label1}>Mockup image</div>
                    <div className={styles.mokupimageAndFileUpload}>
                        {formdata?.img !== "" ? <div className={styles.imageAndAction}>
                            <img
                                className={styles.avatarIcon1}
                                alt=""
                                src={formdata?.img}
                            />
                            <button className={styles.buttonBase} type="button" onClick={() => { SetState("modified"); removecssMockupfile(slug, formdata, setFormData, mockupfile, setMockupFile, "img", "imgName") }} >
                                <img
                                    className={styles.logOutIcon}
                                    alt=""
                                    src="/assets/images/delete.svg"
                                />
                                <div className={styles.delete}>Delete</div>
                            </button>
                        </div> :
                            mockupfile === "" ?
                                <Fileuploadbase handleUpload={handleThumbnailUpload} handleFileChange={(event) => { fileHandle(event, setMockupFile, setMockupProgress, "img", "imgName") }} text="Upload mockup" id="mockup_image" name="mockup_image" accept="image/*" /> :
                                <FileUpload progress={mockupprogress} name={mockupfile} />
                        }
                    </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.title}>
                    <div className={styles.label1}>Background & text color</div>
                    <div className={styles.fontLinks}>
                        <InputComponent label={"Background color"}
                            isLabel={true}
                            value={formdata?.bgColor || ""}
                            name={"bgColor"}
                            change={(event) => handleFormInputChange(event)} isColor={true} />
                        <InputComponent label={"Text color"}
                            isLabel={true}
                            value={formdata?.textColor || ""}
                            name={"textColor"} change={(event) => handleFormInputChange(event)} isColor={true} />

                    </div>

                </div>
                <div className={styles.divider} />
                <div className={styles.title}>
                    <div className={styles.label1}>Table of content</div>
                    <div className={styles.tobContets}>
                        {formdata?.TOB?.length && formdata?.TOB?.map((e, index) => {
                            return (<div className={styles.tobInputs} key={index}>
                                <div className={styles.linkTo}>
                                    <div className={styles.text15}>Name</div>
                                    <div className={styles.inputContainer3}>
                                        <InputComponent isLabel={false}
                                            name={"name"}
                                            value={e?.name || ""}
                                            change={(event) => handleTobChange(event, index)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.linkTo}>
                                    <div className={styles.text15}>Link To</div>
                                    <div className={styles.inputContainer3}>
                                        <InputComponent isLabel={false} value={e?.linkTo || ""} name={"linkTo"} change={(event) => handleTobChange(event, index)} />
                                    </div>
                                </div>
                                <button className={styles.buttonBase} type="button" onClick={() => removeTOB(index)}>
                                    <img
                                        className={styles.logOutIcon}
                                        alt=""
                                        src="/assets/images/delete.svg"
                                    />
                                    <div className={styles.delete}>Delete</div>
                                </button>
                            </div>)
                        })}
                        <button className={styles.addMoreButton} type="button" onClick={addmoreTOB}>
                            <img
                                className={styles.logOutIcon}
                                alt=""
                                src="/assets/images/add-more.svg"
                            />
                            <div className={styles.addMore}>Add more</div>
                        </button>
                    </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.title}>
                    <div className={styles.label1}>Continue</div>
                    <div className={styles.inputContainer}>
                        <Autocomplete
                            underlinestyle={{ display: 'none' }}
                            multiple
                            id="tags-outlined"
                            options={continuedata}
                            onKeyDown={(e) => e.preventDefault()}
                            onChange={(event, value) => handleContinue(value)}
                            getOptionLabel={(option) => option.referenceTitle}
                            isOptionEqualToValue={(option, value) => option.referenceTitle === value.referenceTitle}
                            getOptionDisabled={(option) => (formdata?.continue.length >= 3 ? true : false)}
                            value={formdata?.continue || []}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <InputComponent isLabel={false} name='continue' params={params} placeholder={"Continue"} isAuto={true} />
                            )}
                        />
                    </div>
                </div>
                {isAIHelperOpen && (
                    <PortalDrawer
                        overlayColor="rgba(113, 113, 113, 0.3)"
                        placement="Right"
                        onOutsideClick={closeAIHelper}
                    >
                        <AIHelper onClose={closeAIHelper} formdata={formdata} setFormData={setFormData} setState={SetState} />
                    </PortalDrawer>
                )}
            </div>
        </form>
    );
})

export default ManageCaseStudies;