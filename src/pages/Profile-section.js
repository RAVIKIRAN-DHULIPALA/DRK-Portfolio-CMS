import { memo, useState, useCallback, useEffect, forwardRef } from "react";
import styles from "./ProfileSection.module.css";
import { Avatar } from "@mui/material";
import stringAvatar from "../Providers/ColoredAvatar";
import { UpdateLinks, getOrderedData, getUserData, removethumbnail } from "../Firebase-utils/CallingMethods";
import InputComponent from "../Components/Inputs/InputComponent";
import { Fileuploadbase } from "../Components/Inputs/Fileuploadbase";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { auth } from "../Firebase-utils/config";
import { debounce } from '@mui/material';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, storage } from "../Firebase-utils/config";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { ThumbnailContentProfile } from "../Components/ItemComponents/ThumbnailContentProfile";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfileSection = memo(({ containerName, docName }) => {

    const [data, setData] = useState([]);
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const userUnsubscribe = getUserData(setUser, setInput);
        const unsubscribe = getOrderedData(docName, setData, "links", setLoading);
        return () => { unsubscribe(); userUnsubscribe(); }
    }, [])

    const [state, setState] = useState({
        open: false,
        msg: "",
        severity: ""
    });
    const [input, setInput] = useState({
        "displayName": "",
        "photoURL": ""
    });
    const [type, setType] = useState("");


    const handleClick = (newState) => {
        setState({ ...newState, open: true });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setState({ ...state, open: false });

    };
    const sentVerificationLink = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                handleClick({ msg: "Verification link sent to registered email!", severity: "success" });
            }).catch(() => {
                handleClick({ msg: "Something went wrong in sending verification link. Please try after sometime", severity: "error" });
            });
    }
    const handleInputChange = (event, type) => {
        const data = event.target.value;
        if (data === "") {
            handleClick({ msg: "Display name cannot be empty", severity: "error" });
            return;
        }
        else {
            setType("profile")
            setInput({ ...input, "displayName": data });
        }
    }

    const handleLinkInputChange = (event, type, index) => {
        const dat = event.target.value;
        if (dat === "") {
            handleClick({ msg: `${type} cannot be empty`, severity: "error" });
            return;
        }
        setType("links");
        let d = [...data];
        d[index]["link"] = "https://" + dat;
        setData(d);

    }

    const debounceSave = useCallback(debounce((data, type, links) => {
        //update data into Firebase
        if (type === "profile") {
            updateProfile(auth.currentUser, data).then(() => {
                handleClick({ msg: "Profile updated!", severity: "success" });
            }).catch((error) => {
                handleClick({ msg: "Something went wrong in updating profile. Please try after sometime", severity: "error" });
            });
        }
        else if (type === "links") {
            //update links

            UpdateLinks(links)

            handleClick({ msg: "Portfolio links updated!", severity: "success" });
        }
    }, 1000), []);

    useEffect(() => {
        debounceSave(input, type, data)


    }, [debounceSave, input, data, type]);

    const handleUpload = () => {
        const inputelement = document.getElementById("profile");
        inputelement.click();
    }

    const handleFileChange = (event, index) => {
        const filel = event.target.files[0];
        setFile(filel);
        const storageRef = ref(storage, `${containerName}/` + filel.name);
        const uploadTask = uploadBytesResumable(storageRef, filel);
        // Listen for state changes, errors, and completion of the upload.
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
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setType("profile")
                    setInput({ ...input, "photoURL": downloadURL });
                });
            }
        );
    }


    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={state.open}
                onClose={handleClose}
                autoHideDuration={6000}
            >
                <Alert onClose={handleClose} severity={state.severity} sx={{ width: '100%' }}>
                    {state.msg}
                </Alert>
            </Snackbar>
            <div className={styles.profileSection}>
                <div className={styles.profileHeader}>
                    <img
                        className={styles.imageWrapOuter}
                        alt=""
                        src="/assets/images/image-wrap-inner.png"
                    />
                    <div className={styles.avatarContainer}>
                        {(user?.photoURL !== null ? <img className={styles.avatarProfilePhoto} name="profile-image" alt="" src={user?.photoURL} />
                            : <Avatar className={styles.avatarProfilePhoto}{...stringAvatar(user?.displayName)} />)}

                        <div className={styles.textAndSupportingText}>
                            <h2 className={styles.text1}>{user?.displayName}</h2>
                            <div className={styles.emailAndVerification}>
                                <p className={styles.email}>{user?.email}</p>
                                {!user?.emailVerified ?
                                    <button className={styles.button} type="button" onClick={() => sentVerificationLink()}>
                                        <div className={styles.buttonBase}>
                                            <div className={styles.text2}>Send verification link</div>
                                        </div>
                                    </button> :
                                    <img
                                        className={styles.checkVerified02Icon}
                                        alt=""
                                        src="/assets/images/check-verified-02.svg"
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.personalDetails}>
                        <h3 className={styles.text3}>Personal info</h3>
                        <div className={styles.content1}>
                            <div className={styles.inputField}>
                                <InputComponent isLabel={true} label={"Display name"} type="text" name="displayName" value={input?.displayName} change={(event) => handleInputChange(event, "displayName")} />
                            </div>
                            {user?.photoURL !== null ? <div className={styles.inputField}>
                                <ThumbnailContentProfile input={input} setInput={setInput} setType={setType} />
                            </div> :
                                <Fileuploadbase handleUpload={handleUpload} text={"Upload profile pic"} accept="image/*" id={"profile"} name={"profilepic"} handleFileChange={handleFileChange} />
                            }
                        </div>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.portfolioLinks}>
                        <h3 className={styles.text6}>Portfolio links</h3>
                        <div className={styles.content3}>
                            {data.map((ele, i) => {
                                return <InputComponent key={i} isLabel={true} label={ele.name} type="text" name="deployedlink" isLink={true} value={ele.link.split("//")[1]} change={(event) => handleLinkInputChange(event, ele.name, i)} />
                            })}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
});

export default ProfileSection;
