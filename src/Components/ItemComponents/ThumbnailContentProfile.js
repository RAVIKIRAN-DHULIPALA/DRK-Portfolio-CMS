import React from "react";
import styles from "./AddNew.module.css";
export function ThumbnailContentProfile({
    input, setType, setInput
}) {
    return <div className={styles.thumbnailContent}>
        <div className={styles.uploadedFileAction}>
            <img className={styles.imageIcon} loading="lazy" alt="" src={input?.photoURL} />
            <button className={styles.deleteButton} type="button" onClick={() => {
                setType("profile")
                setInput({ ...input, "photoURL": "" });
            }}>
                <img className={styles.xIcon} alt="" src="/assets/images/delete.svg" />
                <div className={styles.text}>Delete</div>
            </button>
        </div>
    </div>;
}
