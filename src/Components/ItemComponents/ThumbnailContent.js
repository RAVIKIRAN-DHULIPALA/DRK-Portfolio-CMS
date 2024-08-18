import React from "react";
import styles from "./AddNew.module.css";
export function ThumbnailContent({
    removethumbnail,
    index,
    formFields,
    setFormFields,
    file,
    setFile,
    attributeName,
    docName,
    url
}) {
    return <div className={styles.thumbnailContent}>
        <div className={styles.uploadedFileAction}>
            <img className={styles.imageIcon} loading="lazy" alt="" src={url} />
            <button className={styles.deleteButton} type="button" onClick={() => removethumbnail(index, attributeName, formFields, setFormFields, file, setFile, docName)}>
                <img className={styles.xIcon} alt="" src="/assets/images/delete.svg" />
                <div className={styles.text}>Delete</div>
            </button>
        </div>
    </div>;
}
