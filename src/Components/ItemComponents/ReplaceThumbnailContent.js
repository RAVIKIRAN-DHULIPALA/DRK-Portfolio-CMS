import React from "react";
import styles from "./Edit.module.css";

export function ReplaceThumbnailContent({
    replaceThumbnail,
    formFields,
    setFormFields,
    containerName
}) {
    return <div className={styles.thumbnailContent}>
        <div className={styles.uploadedFileAction}>
            <img className={styles.imageIcon} loading="lazy" alt="" src={formFields.thumbnail_url} />
            <button className={styles.deleteButton} type="button" onClick={() => replaceThumbnail(containerName, formFields.thumbnailName, formFields, setFormFields)}>
                <img className={styles.xIcon} alt="" src="/assets/images/delete.svg" />
                <div className={styles.text}>Delete</div>
            </button>
        </div>
    </div>;
}
